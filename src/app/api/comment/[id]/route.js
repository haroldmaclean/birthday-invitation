import { withCORS } from '@/lib/cors';
import { connectToMongoose } from '@/lib/mongoose';
import comment from '@/models/comment';
import { NextResponse } from 'next/server';

async function handler(req) {
  await connectToMongoose();

  // ✅ CREATE COMMENT
  if (req.method === 'POST') {
    try {
      const body = await req.json();

      // 🔥 FIX: Pull 'author' from the frontend request
      const { text, author, avatar, image } = body;

      if (!text || text.trim() === '') {
        return NextResponse.json(
          { message: 'Comment cannot be empty' },
          { status: 400 },
        );
      }

      if (text.length > 300) {
        return NextResponse.json(
          { message: 'Comment is too long (max 300 characters)' },
          { status: 400 },
        );
      }

      // 🔥 FIX: Save the actual author name sent from the form
      const newComment = await comment.create({
        text,
        author: author || 'Anonymous', // Use the name from the form, or default if empty
        avatar: avatar || '',
        image: image || '',
      });

      return NextResponse.json({ newComment }, { status: 201 });
    } catch (err) {
      console.error('Error posting comment:', err);
      return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
  }

  // ✅ GET COMMENTS
  if (req.method === 'GET') {
    try {
      const comments = await comment.find().sort({ createdAt: -1 });
      return NextResponse.json(comments);
    } catch (err) {
      return NextResponse.json(
        { message: 'Failed to fetch comments' },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}

export const GET = withCORS(handler);
export const POST = withCORS(handler);
export const OPTIONS = withCORS(() => new Response(null, { status: 204 }));

// import { connectToMongoose } from '@/lib/mongoose';
// import comment from '@/models/comment';
// import { NextResponse } from 'next/server';

// // DELETE comment
// export async function DELETE(req, { params }) {
//   try {
//     await connectToMongoose();

//     const deleted = await comment.findByIdAndDelete(params.id);

//     if (!deleted) {
//       return NextResponse.json(
//         { message: 'Comment not found' },
//         { status: 404 },
//       );
//     }

//     return NextResponse.json(
//       { message: 'Comment deleted successfully' },
//       { status: 200 },
//     );
//   } catch (error) {
//     console.error('DELETE error:', error);
//     return NextResponse.json({ message: 'Server error' }, { status: 500 });
//   }
// }

// // UPDATE comment
// export async function PATCH(req, { params }) {
//   try {
//     await connectToMongoose();

//     const body = await req.json();
//     const { text, avatar, image } = body;

//     const updated = await comment.findByIdAndUpdate(
//       params.id,
//       {
//         text,
//         avatar,
//         image,
//       },
//       { new: true },
//     );

//     if (!updated) {
//       return NextResponse.json(
//         { message: 'Comment not found' },
//         { status: 404 },
//       );
//     }

//     return NextResponse.json(updated, { status: 200 });
//   } catch (error) {
//     console.error('PATCH error:', error);
//     return NextResponse.json({ message: 'Server error' }, { status: 500 });
//   }
// }
