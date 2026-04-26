import { connectToMongoose } from '@/lib/mongoose';
import Invitation from '@/models/Invitation';

// ✅ GET current like count
export async function GET() {
  try {
    await connectToMongoose();
    const invitation = await Invitation.findOne();
    // Return the length of the likes array (or 0 if it doesn't exist yet)
    const count = Array.isArray(invitation?.likes)
      ? invitation.likes.length
      : invitation?.likes || 0;
    return Response.json({ likes: count });
  } catch (error) {
    console.error('⨯ GET likes error:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch' }), {
      status: 500,
    });
  }
}

// ✅ POST to toggle unique like
export async function POST(req) {
  try {
    await connectToMongoose();
    const { email } = await req.json(); // We need the user's email to ensure uniqueness

    if (!email) {
      return new Response(
        JSON.stringify({ message: 'Authentication required' }),
        { status: 401 },
      );
    }

    let invitation = await Invitation.findOne();

    if (!invitation) {
      invitation = await Invitation.create({
        title: 'Birthday Bash Invitation',
        date: 'April 27, 2025',
        location: 'Celebration Park, Centuary City',
        likes: [email], // Start with an array containing the first liker
      });
    } else {
      // YouTube-style Toggle Logic:
      // If the email is already in the array, $pull removes it (Unlike)
      // If it's not there, $addToSet adds it uniquely (Like)
      const hasLiked = invitation.likes.includes(email);

      invitation = await Invitation.findOneAndUpdate(
        {}, // Target the invitation
        hasLiked
          ? { $pull: { likes: email } }
          : { $addToSet: { likes: email } },
        { new: true },
      );
    }

    return Response.json({
      likes: invitation.likes.length,
      hasLiked: invitation.likes.includes(email),
    });
  } catch (error) {
    console.error('⨯ POST like error:', error);
    return new Response(JSON.stringify({ message: 'Failed to toggle like' }), {
      status: 500,
    });
  }
}

// // src/app/api/likes/route.js
// import { connectToMongoose } from '@/lib/mongoose';
// import Invitation from '@/models/Invitation';

// // GET current like count
// export async function GET() {
//   try {
//     await connectToMongoose();
//     const invitation = await Invitation.findOne();
//     return Response.json({ likes: invitation?.likes || 0 });
//   } catch (error) {
//     console.error('⨯ GET likes error:', error);
//     return new Response(
//       JSON.stringify({
//         message: 'Failed to fetch likes',
//         error: error.message,
//       }),
//       { status: 500 }
//     );
//   }
// }

// // POST to increment like count
// export async function POST() {
//   try {
//     await connectToMongoose();
//     let invitation = await Invitation.findOne();

//     if (!invitation) {
//       invitation = await Invitation.create({
//         title: 'Birthday Bash Invitation',
//         date: 'April 27, 2025',
//         location: 'Celebration Park, Centuary City',
//         likes: 1,
//       });
//     } else {
//       invitation.likes += 1;
//       await invitation.save();
//     }

//     return Response.json({ likes: invitation.likes });
//   } catch (error) {
//     console.error('⨯ POST like error:', error);
//     return new Response(
//       JSON.stringify({ message: 'Failed to add like', error: error.message }),
//       { status: 500 }
//     );
//   }
// }
