import dbConnect from '@/utils/db';
import Invitation from '@/models/Invitation';

// GET current like count
export async function GET() {
  await dbConnect();
  const invitation = await Invitation.findOne();
  return Response.json({ likes: invitation?.likes || 0 });
}

// POST to increment like count
export async function POST() {
  await dbConnect();

  let invitation = await Invitation.findOne();

  if (!invitation) {
    invitation = await Invitation.create({
      title: 'Birthday Bash Invitation',
      date: 'April 27, 2025',
      location: 'Celebration Park, centuary city',
      likes: 1,
    });
  } else {
    invitation.likes += 1;
    await invitation.save();
  }

  return Response.json({ likes: invitation.likes });
}
