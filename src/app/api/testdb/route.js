// /app/api/testdb/route.js (or src/app/api/testdb/route.js)
import { connectToMongoose } from '@/lib/mongoose'; // ✅ Refactored;

export async function GET() {
  try {
    await connectToMongoose();
    return new Response(
      JSON.stringify({ message: 'Database connected successfully' }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('Database connection error:', error);
    return new Response(
      JSON.stringify({ error: 'Database connection failed' }),
      {
        status: 500,
      }
    );
  }
}
