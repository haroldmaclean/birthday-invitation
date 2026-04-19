import { connectToMongoose } from '@/lib/mongoose';
import comment from '@/models/comment';
import { NextResponse } from 'next/server';

// ✅ DELETE comment
export async function DELETE(req, { params }) {
  try {
    console.log('Deleting ID:', params.id); // 👈 ADD THIS

    await connectToMongoose();

    const deleted = await comment.findByIdAndDelete(params.id);

    console.log('Deleted result:', deleted); // 👈 ADD THIS

    if (!deleted) {
      return NextResponse.json(
        { message: 'Comment not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: 'Comment deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
// ✅ UPDATE comment
export async function PATCH(req, { params }) {
  try {
    await connectToMongoose();

    const body = await req.json();
    const { text, avatar, image } = body;

    const updated = await comment.findByIdAndUpdate(
      params.id,
      { text, avatar, image },
      { new: true },
    );

    if (!updated) {
      return NextResponse.json(
        { message: 'Comment not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

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
