import { headers } from 'next/headers';
import { Webhook } from 'svix';
import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';

export async function POST(req) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.WEBHOOK_SECRET);

  let evt;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, ...attributes } = evt.data;
    const primaryEmail = email_addresses.find(email => email.id === attributes.primary_email_address_id);

    try {
      await dbConnect();

      await User.findOneAndUpdate(
        { clerkId: id },
        {
          clerkId: id,
          email: primaryEmail.email_address,
          name: `${attributes.first_name || ''} ${attributes.last_name || ''}`.trim(),
          $setOnInsert: { createdAt: new Date() }
        },
        { upsert: true, new: true }
      );

      return new Response('User updated', { status: 200 });
    } catch (error) {
      console.error('Error updating user:', error);
      return new Response('Error updating user', { status: 500 });
    }
  }

  return new Response('Webhook received', { status: 200 });
} 