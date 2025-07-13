import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Booking from '@/models/booking';
import { sendMail } from '@/lib/send-mail';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const booking = await Booking.findById(params.id);
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return await updateBooking(request, { params });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return await updateBooking(request, { params });
}

async function updateBooking(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { status, confirmationMessage, adminNotes, confirmedBy } = body;
    
    const booking = await Booking.findById(params.id);
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    // Update booking
    const updateData: any = {};
    
    if (status) {
      updateData.status = status;
    }
    
    if (confirmationMessage) {
      updateData.confirmationMessage = confirmationMessage;
    }
    
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }
    
    if (confirmedBy) {
      updateData.confirmedBy = confirmedBy;
    }
    
    // If status is being confirmed, set confirmedAt timestamp
    if (status === 'confirmed' && !booking.confirmedAt) {
      updateData.confirmedAt = new Date();
    }
    
    const updatedBooking = await Booking.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    );
    
    // If booking is confirmed, send confirmation message to customer
    if (status === 'confirmed' && booking.status !== 'confirmed') {
      await sendConfirmationToCustomer(updatedBooking);
      await sendConfirmationEmailToCustomer(updatedBooking);
    }
    
    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const booking = await Booking.findByIdAndDelete(params.id);
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
}

// Function to send confirmation message to customer
async function sendConfirmationToCustomer(booking: any) {
  const confirmationMessage = booking.confirmationMessage || 
    `✅ *BOOKING CONFIRMED!*

Dear ${booking.name},

Your table reservation has been confirmed!

📅 *Booking Details:*
• Date: ${new Date(booking.date).toLocaleDateString('en-IN')}
• Time: ${booking.time}
• People: ${booking.people}
${booking.specialRequests ? `• Special Requests: ${booking.specialRequests}` : ''}

📍 *Restaurant Location:*
Lakhna Restaurant
Lakhna, Bihar 804453

📞 *Contact:* +91 96089 89499

We look forward to serving you! Please arrive 5 minutes before your booking time.

Thank you for choosing Lakhna Restaurant! 🍽️`;

  // Log the message for manual sending
  console.log('\n📱 ===== CUSTOMER CONFIRMATION =====');
  console.log(`📞 To: +91${booking.phone}`);
  console.log(`📝 Message:`);
  console.log(confirmationMessage);
  console.log('📱 ===== END CONFIRMATION =====\n');
  
  console.log('🔧 INSTRUCTIONS:');
  console.log('1. Open WhatsApp on your business phone (+91 96089 89499)');
  console.log(`2. Search for or add contact: +91${booking.phone}`);
  console.log('3. Copy and paste the message above');
  console.log('4. Send the confirmation message');
  console.log('5. Update the booking status in admin panel\n');
  
  // In production, you can integrate with Twilio here:
  /*
  const twilio = require('twilio');
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  
  await client.messages.create({
    from: 'whatsapp:+919608989499',
    to: `whatsapp:+91${booking.phone}`,
    body: confirmationMessage
  });
  */
}

// Function to send confirmation email to customer
async function sendConfirmationEmailToCustomer(booking: any) {
  try {
    const formattedDate = new Date(booking.date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    await sendMail({
      to: booking.email,
      subject: '✅ Table Reservation Confirmed - Lakhna Restaurant',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #e74c3c; margin: 0;">🍽️ Lakhna Restaurant</h1>
            <p style="color: #7f8c8d; margin: 5px 0;">Your reservation is confirmed!</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #27ae60, #2ecc71); padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
            <h2 style="color: white; margin: 0;">✅ Booking Confirmed!</h2>
            <p style="color: white; margin: 10px 0 0 0;">Your table reservation has been confirmed</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #2c3e50; margin-top: 0;">📋 Confirmed Booking Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${booking.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Date:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${formattedDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Time:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${booking.time}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Number of People:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${booking.people}</td>
              </tr>
              ${booking.specialRequests ? `
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Special Requests:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${booking.specialRequests}</td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #27ae60; margin: 0; font-weight: bold;">
              ⏰ Please arrive 5 minutes before your booking time.
            </p>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #856404; margin-top: 0;">📍 Restaurant Information:</h4>
            <p style="color: #856404; margin: 5px 0;">🍽️ Lakhna Restaurant</p>
            <p style="color: #856404; margin: 5px 0;">📍 Lakhna, Bihar 804453</p>
            <p style="color: #856404; margin: 5px 0;">📞 Phone: +91 96089 89499</p>
            <p style="color: #856404; margin: 5px 0;">📧 Email: m3361555@gmail.com</p>
          </div>
          
          <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #0c5460; margin-top: 0;">📝 Important Notes:</h4>
            <ul style="color: #0c5460; margin: 5px 0;">
              <li>Please arrive on time for your reservation</li>
              <li>If you need to cancel or modify, please contact us at least 2 hours in advance</li>
              <li>We look forward to serving you!</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #7f8c8d;">Thank you for choosing Lakhna Restaurant!</p>
            <p style="color: #7f8c8d;">We look forward to providing you with an excellent dining experience.</p>
          </div>
        </div>
      `
    });
    
    console.log(`✅ Booking confirmation email sent to ${booking.email}`);
  } catch (error) {
    console.error('❌ Error sending booking confirmation email:', error);
  }
} 