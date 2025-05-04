// app/api/comment/route.js
import { withCORS } from '@/lib/cors';
import { connectToMongoose } from '@/lib/mongoose';
import Comment from '@/models/Comment';
import { NextResponse } from 'next/server';

async function handler(req) {
  await connectToMongoose();

  if (req.method === 'POST') {
    try {
      const body = await req.json();
      const { text } = body;

      if (!text || text.trim() === '') {
        return NextResponse.json(
          { message: 'Comment cannot be empty' },
          { status: 400 }
        );
      }

      if (text.length > 300) {
        return NextResponse.json(
          { message: 'Comment is too long (max 300 characters)' },
          { status: 400 }
        );
      }

      const newComment = await Comment.create({
        text,
        author: 'Anonymous',
      });

      return NextResponse.json({ newComment }, { status: 201 });
    } catch (err) {
      console.error('Error posting comment:', err);
      return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
  }

  if (req.method === 'GET') {
    try {
      const comments = await Comment.find().sort({ createdAt: -1 });
      return NextResponse.json(comments);
    } catch (err) {
      return NextResponse.json(
        { message: 'Failed to fetch comments' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}

export const GET = withCORS(handler);
export const POST = withCORS(handler);
export const OPTIONS = withCORS(() => new Response(null, { status: 204 }));
