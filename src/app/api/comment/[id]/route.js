// import { connectToMongoose } from '@/lib/mongoose';
// import comment from '@/models/comment';
// import { NextResponse } from 'next/server';

// export async function DELETE(req, { params }) {
//   await connectToMongoose();

//   try {
//     const deleted = await Comment.findByIdAndDelete(params.id);
//     if (!deleted) {
//       return NextResponse.json(
//         { message: 'Comment not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ message: 'Comment deleted' }, { status: 200 });
//   } catch (error) {
//     console.error('Error deleting comment:', error);
//     return NextResponse.json({ message: 'Server error' }, { status: 500 });
//   }
// }

import { connectToMongoose } from '@/lib/mongoose';
import comment from '@/models/comment'; // Note: lowercase 'comment'
import { NextResponse } from 'next/server';

// Handle DELETE
export async function DELETE(req, { params }) {
  await connectToMongoose();
  try {
    // FIXED: changed Comment to comment to match your import
    const deleted = await comment.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json(
        { message: 'Comment not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: 'Comment deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// NEW: Handle EDIT (PATCH)
export async function PATCH(req, { params }) {
  await connectToMongoose();
  try {
    const { text } = await req.json();
    const updated = await comment.findByIdAndUpdate(
      params.id,
      { text },
      { new: true } // Returns the updated document
    );

    if (!updated) {
      return NextResponse.json(
        { message: 'Comment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
