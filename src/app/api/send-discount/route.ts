import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Discount from '@/models/discount';
import { sendMail } from '@/lib/send-mail';

// Generate unique discount code
function generateDiscountCode(): string {
  const prefix = 'LAKHNA';
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${randomPart}`;
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}





export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { contact } = body;
    
    if (!contact) {
      return NextResponse.json(
        { error: 'Contact information is required' },
        { status: 400 }
      );
    }
    
    // Clean and validate contact
    const cleanContact = contact.trim();
    const isEmail = isValidEmail(cleanContact.toLowerCase());
    
    if (!isEmail) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }
    
    // Check if contact already exists
    const existingDiscount = await Discount.findOne({ contact: cleanContact });
    if (existingDiscount) {
      return NextResponse.json(
        { error: '⚠️ This offer has already been used with this number or email.' },
        { status: 409 }
      );
    }
    
    // Generate unique discount code
    let code = generateDiscountCode();
    let isUnique = false;
    
    while (!isUnique) {
      const existingCode = await Discount.findOne({ code });
      if (!existingCode) {
        isUnique = true;
      } else {
        code = generateDiscountCode();
      }
    }
    
    // Create discount record
    const discount = new Discount({
      contact: cleanContact,
      code: code!
    });
    
    await discount.save();
    
    // Prepare message
    const message = `🎁 Your 10% discount code is *${code}*.

Please message our team on WhatsApp at +91 96089 89499 to place your order. Our team will assist you further.

*Offer valid for first-time users only. Code expires in 30 days.*`;
    
    // Send message via email
    try {
      await sendMail({
        to: cleanContact,
        subject: 'Your 10% Discount Code 🎁 - Lakhna Restaurant',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #e74c3c; text-align: center;">🎁 Your 10% Discount Code</h2>
            
            <div style="background: linear-gradient(135deg, #f39c12, #e74c3c); padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
              <h1 style="color: white; font-size: 2em; margin: 0;">${code}</h1>
              <p style="color: white; margin: 10px 0 0 0;">Use this code to get 10% off your first order!</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #2c3e50; margin-top: 0;">How to use your discount:</h3>
              <ol style="color: #34495e;">
                <li>Message our team on WhatsApp at <strong>+91 96089 89499</strong></li>
                <li>Tell us what you'd like to order</li>
                <li>Mention your discount code: <strong>${code}</strong></li>
                <li>We'll apply the discount and confirm your order!</li>
              </ol>
            </div>
            
            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #27ae60; margin: 0; font-weight: bold;">
                ⏰ Offer valid for first-time users only. Code expires in 30 days.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #7f8c8d;">Thank you for choosing Lakhna Restaurant!</p>
              <p style="color: #7f8c8d;">📍 Lakhna, Bihar 804453</p>
            </div>
          </div>
        `
      });
      
      return NextResponse.json({
        success: true,
        message: `🎉 Your 10% discount code is ${code}. Check your email for the complete details!`,
        code: code
      });
      
    } catch (sendError) {
      console.error('Error sending message:', sendError);
      
      // Delete the discount record if sending failed
      await Discount.findByIdAndDelete(discount._id);
      
      return NextResponse.json(
        { error: 'Failed to send discount code. Please try again.' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Error in send-discount API:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
} 