// src/app/api/invitations/route.js
import Invitation from '@/models/Invitation'; // Ensure this path is correct
import { connectToMongoose } from '@/lib/mongoose';

export async function POST(req) {
  try {
    await connectToMongoose();

    const body = await req.json();

    const newInvitation = new Invitation({
      title: body.title,
      date: body.date,
      location: body.location,
    });

    const saved = await newInvitation.save();

    return Response.json({
      message: 'Invitation added!',
      invitationId: saved._id,
    });
  } catch (error) {
    console.error('⨯ Error saving invitation:', error);
    return new Response(
      JSON.stringify({
        message: 'Failed to add invitation',
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
