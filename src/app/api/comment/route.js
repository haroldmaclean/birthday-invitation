import dbConnect from '@/utils/db';
import Invitation from '@/models/invitation';

export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text || text.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Comment cannot be empty.' }),
        {
          status: 400,
        }
      );
    }

    await dbConnect();

    const newComment = {
      text,
      createdAt: new Date(),
    };

    const updated = await Invitation.findOneAndUpdate(
      {},
      { $push: { comments: newComment } },
      { new: true }
    );

    if (!updated) {
      return new Response(JSON.stringify({ error: 'Invitation not found' }), {
        status: 404,
      });
    }

    // Return just the newly added comment
    const addedComment = updated.comments[updated.comments.length - 1];

    return new Response(JSON.stringify({ newComment: addedComment }), {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
    });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const invitation = await Invitation.findOne();

    if (!invitation) {
      return new Response(JSON.stringify({ comments: [] }), { status: 200 });
    }

    const sortedComments = invitation.comments
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return new Response(JSON.stringify({ comments: sortedComments }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to fetch comments' }), {
      status: 500,
    });
  }
}
