import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Booking from '@/models/booking';
import { sendMail } from '@/lib/send-mail';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const date = searchParams.get('date');
    
    let query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = {
        $gte: startDate,
        $lt: endDate
      };
    }
    
    const bookings = await Booking.find(query).sort({ date: 1, time: 1, createdAt: -1 });
    
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, phone, email, date, time, people, specialRequests } = body;
    
    // Validate required fields
    if (!name || !phone || !email || !date || !time || !people) {
      return NextResponse.json(
        { error: 'Missing required fields: name, phone, email, date, time, and people are required' },
        { status: 400 }
      );
    }
    
    // Validate phone number format (Indian numbers)
    const cleanPhone = phone.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: 'Please enter a valid Indian phone number' },
        { status: 400 }
      );
    }
    
    // Validate date (must be future date)
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (bookingDate < today) {
      return NextResponse.json(
        { error: 'Booking date must be in the future' },
        { status: 400 }
      );
    }
    
    // Validate people count
    if (people < 1 || people > 20) {
      return NextResponse.json(
        { error: 'Number of people must be between 1 and 20' },
        { status: 400 }
      );
    }
    
    // Create booking
    const booking = new Booking({
      name: name.trim(),
      phone: cleanPhone,
      email: email.trim().toLowerCase(),
      date: bookingDate,
      time,
      people: parseInt(people),
      specialRequests: specialRequests ? specialRequests.trim() : '',
    });
    
    await booking.save();
    
    // Send confirmation email to customer
    await sendBookingConfirmationToCustomer(booking);
    
    // Send notification email to business
    await sendBookingNotificationToBusiness(booking);
    
    // Send WhatsApp notification to business
    await sendBookingNotificationToBusinessWhatsApp(booking);
    
    return NextResponse.json({
      success: true,
      message: 'Booking request submitted successfully! We will confirm your reservation via email and WhatsApp within 2 hours.',
      booking
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating booking:', error);
    
    // Handle Mongoose validation errors
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError') {
      const validationErrors = Object.values((error as any).errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: `Validation failed: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

// Function to send booking confirmation email to customer
async function sendBookingConfirmationToCustomer(booking: any) {
  try {
    const formattedDate = new Date(booking.date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    await sendMail({
      to: booking.email,
      subject: '🎉 Table Reservation Confirmation - Lakhna Restaurant',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #e74c3c; margin: 0;">🍽️ Lakhna Restaurant</h1>
            <p style="color: #7f8c8d; margin: 5px 0;">Thank you for choosing us!</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #f39c12, #e74c3c); padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
            <h2 style="color: white; margin: 0;">🎉 Table Reservation Received!</h2>
            <p style="color: white; margin: 10px 0 0 0;">We've received your booking request</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #2c3e50; margin-top: 0;">📋 Booking Details:</h3>
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
              ⏰ Our team will confirm your booking via WhatsApp or email within 2 hours.
            </p>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #856404; margin-top: 0;">📞 Contact Information:</h4>
            <p style="color: #856404; margin: 5px 0;">📱 WhatsApp: +91 96089 89499</p>
            <p style="color: #856404; margin: 5px 0;">📧 Email: m3361555@gmail.com</p>
            <p style="color: #856404; margin: 5px 0;">📍 Location: Lakhna, Bihar 804453</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #7f8c8d;">Thank you for choosing Lakhna Restaurant!</p>
            <p style="color: #7f8c8d;">We look forward to serving you.</p>
          </div>
        </div>
      `
    });
    
    console.log(`✅ Booking confirmation email sent to ${booking.email}`);
  } catch (error) {
    console.error('❌ Error sending booking confirmation email:', error);
  }
}

// Function to send booking notification email to business
async function sendBookingNotificationToBusiness(booking: any) {
  try {
    const formattedDate = new Date(booking.date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    await sendMail({
      to: 'm3361555@gmail.com', // Company email
      subject: `🆕 New Table Booking - ${booking.name} (${formattedDate})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #e74c3c; margin: 0;">🍽️ Lakhna Restaurant</h1>
            <p style="color: #7f8c8d; margin: 5px 0;">New Table Booking Request</p>
          </div>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h2 style="color: #856404; margin: 0;">🆕 NEW BOOKING REQUEST</h2>
            <p style="color: #856404; margin: 10px 0 0 0;">Please review and confirm this booking</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #2c3e50; margin-top: 0;">👤 Customer Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${booking.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">+91 ${booking.phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${booking.email}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #2c3e50; margin-top: 0;">📅 Booking Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
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
            <h4 style="color: #27ae60; margin-top: 0;">🆔 Booking ID:</h4>
            <p style="color: #27ae60; margin: 5px 0; font-family: monospace; font-size: 14px;">${booking._id}</p>
          </div>
          
          <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #0c5460; margin-top: 0;">📋 Action Required:</h4>
            <p style="color: #0c5460; margin: 5px 0;">Please confirm this booking by:</p>
            <ul style="color: #0c5460; margin: 5px 0;">
              <li>Replying to this email</li>
              <li>Sending a WhatsApp message to +91 ${booking.phone}</li>
              <li>Updating the booking status in the admin panel</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #7f8c8d;">This is an automated notification from Lakhna Restaurant booking system.</p>
          </div>
        </div>
      `
    });
    
    console.log(`✅ Booking notification email sent to business`);
  } catch (error) {
    console.error('❌ Error sending booking notification email to business:', error);
  }
}

// Function to send booking notification to business WhatsApp
async function sendBookingNotificationToBusinessWhatsApp(booking: any) {
  const message = `🆕 *NEW TABLE BOOKING REQUEST*

👤 *Customer Details:*
• Name: ${booking.name}
• Phone: +91${booking.phone}
• Email: ${booking.email}

📅 *Booking Details:*
• Date: ${new Date(booking.date).toLocaleDateString('en-IN')}
• Time: ${booking.time}
• People: ${booking.people}
${booking.specialRequests ? `• Special Requests: ${booking.specialRequests}` : ''}

🆔 *Booking ID:* ${booking._id}

To confirm this booking, reply with:
✅ CONFIRM ${booking._id}

To cancel this booking, reply with:
❌ CANCEL ${booking._id}

To add notes, reply with:
📝 NOTES ${booking._id} [your notes]`;

  // Log the message for manual sending
  console.log('\n📱 ===== BUSINESS WHATSAPP NOTIFICATION =====');
  console.log('📞 This message should be sent TO your business number');
  console.log('📝 Message:');
  console.log(message);
  console.log('📱 ===== END NOTIFICATION =====\n');
  
  console.log('🔧 INSTRUCTIONS:');
  console.log('1. This is a notification that should be sent TO your business');
  console.log('2. In a real setup, this would come from the customer');
  console.log('3. For now, you can manually send this to yourself for testing\n');
  
  // In production, you can integrate with Twilio here:
  /*
  const twilio = require('twilio');
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  
  await client.messages.create({
    from: 'whatsapp:+919608989499',
    to: 'whatsapp:+919608989499', // Your business number
    body: message
  });
  */
} 