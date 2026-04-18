import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Force configuration to use the EXACT names in your .env.local
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY, // 🔥 Added NEXT_PUBLIC_ to match your file
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  // Check if keys are missing before even trying to upload
  if (
    !process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.error(
      'CRITICAL: Cloudinary API keys are missing from environment variables.',
    );
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 },
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      const upload_stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'ruth_birthday_comments',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary Stream Error:', error);
            return reject(error);
          }
          resolve(result);
        },
      );
      upload_stream.end(buffer);
    });

    if (!result?.secure_url) {
      return NextResponse.json(
        { error: 'Upload failed (no URL returned)' },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: result.secure_url }, { status: 200 });
  } catch (error) {
    console.error('UPLOAD ERROR:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error.message },
      { status: 500 },
    );
  }
}
