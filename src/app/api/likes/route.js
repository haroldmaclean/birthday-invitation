// src/app/api/likes/route.js
import { connectToMongoose } from '@/lib/mongoose';
import Invitation from '@/models/Invitation';

// GET current like count
export async function GET() {
  try {
    await connectToMongoose();
    const invitation = await Invitation.findOne();
    return Response.json({ likes: invitation?.likes || 0 });
  } catch (error) {
    console.error('⨯ GET likes error:', error);
    return new Response(
      JSON.stringify({
        message: 'Failed to fetch likes',
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

// POST to increment like count
export async function POST() {
  try {
    await connectToMongoose();
    let invitation = await Invitation.findOne();

    if (!invitation) {
      invitation = await Invitation.create({
        title: 'Birthday Bash Invitation',
        date: 'April 27, 2025',
        location: 'Celebration Park, Centuary City',
        likes: 1,
      });
    } else {
      invitation.likes += 1;
      await invitation.save();
    }

    return Response.json({ likes: invitation.likes });
  } catch (error) {
    console.error('⨯ POST like error:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to add like', error: error.message }),
      { status: 500 }
    );
  }
}
