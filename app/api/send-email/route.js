import { Resend } from 'resend';
import { getOrderConfirmationEmail, getAdminOrderNotificationEmail } from '@/app/lib/emailTemplates';

const resend = new Resend(process.env.RESEND_API_KEY);

const emailConfig = {
  from: 'Crystal Shop <orders@your-verified-domain.com>',
  replyTo: 'support@your-verified-domain.com',
};

export async function POST(req) {
  try {
    const { order, type } = await req.json();

    if (type === 'customer') {
      const { subject, html } = getOrderConfirmationEmail(order);
      await resend.emails.send({
        from: emailConfig.from,
        to: order.customerInfo.email,
        subject,
        html,
        tags: [{ name: 'orderConfirmation' }]
      });
    }

    if (type === 'admin') {
      const { subject, html } = getAdminOrderNotificationEmail(order);
      await resend.emails.send({
        from: emailConfig.from,
        to: process.env.ADMIN_EMAIL,
        subject,
        html,
        tags: [{ name: 'adminNotification' }]
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error('Resend API Error:', error.response.data);
    }
    return Response.json({ error: 'Failed to send email', details: error.message }, { status: 500 });
  }
} 