import { connectToMongoose } from '@/lib/mongoose';
import Comment from '@/models/comment';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
  await connectToMongoose();

  try {
    const deleted = await Comment.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json(
        { message: 'Comment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Comment deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
