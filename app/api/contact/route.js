import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getAdminEmailTemplate, getUserEmailTemplate } from '@/app/utils/emailTemplates';
import { validateContactForm } from '@/app/utils/validation';
import { createRateLimiter } from '@/app/utils/rateLimiter';

const limiter = createRateLimiter();
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request) {
  try {
    // Apply rate limiting
    const limitResult = await limiter.check(request);
    if (!limitResult.success) {
      return NextResponse.json(
        { error: 'لقد تجاوزت الحد المسموح به من المحاولات. الرجاء المحاولة لاحقاً' },
        { status: 429 }
      );
    }

    const data = await request.json();
    
    // Validate and sanitize the data
    const { isValid, errors, sanitizedData } = validateContactForm(data);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'بيانات غير صحيحة', errors },
        { status: 400 }
      );
    }

    // Send email to admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `رسالة جديدة: ${sanitizedData.subject}`,
      html: getAdminEmailTemplate(sanitizedData),
    });

    // Send confirmation email to user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: sanitizedData.email,
      subject: 'شكراً لتواصلك معنا',
      html: getUserEmailTemplate(sanitizedData),
    });

    return NextResponse.json({
      message: 'تم استلام رسالتك بنجاح'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إرسال الرسالة' },
      { status: 500 }
    );
  }
} 