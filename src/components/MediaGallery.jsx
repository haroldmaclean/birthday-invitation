'use client';

export default function MediaGallery() {
  /**
   * Make sure your .env.local contains:
   * NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=ddfgssu78
   */

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  /**
   * IMPORTANT RULE (Cloudinary):
   * - Do NOT include version (v123...)
   * - Do NOT include file extension (.mp4)
   *
   * Original file:
   * ruth-video.mp4_tcf4wh.mp4
   *
   * Correct public_id:
   */
  const videoPublicId = 'ruth-video.mp4_tcf4wh';

  /**
   * Cloudinary Video Transformations:
   * - f_auto: automatic format
   * - q_auto: automatic quality
   * - c_crop,g_center,y_60: crops top 60px to remove CapCut watermark
   *   but preserves most of video
   * - w_720,h_auto: width 720px, height auto (keeps original aspect ratio)
   */
  const videoUrl = `https://res.cloudinary.com/${cloudName}/video/upload/c_crop,g_center,y_60,w_720,h_auto,f_auto,q_auto/${videoPublicId}.mp4`;

  return (
    <div className="w-full max-w-md mx-auto my-8">
      {/* VIDEO CONTAINER */}
      <div className="relative w-full aspect-9/16 rounded-xl overflow-hidden shadow-lg">
        <video
          controls
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* OPTIONAL CAPTION */}
      <p className="mt-3 text-sm text-gray-600 text-center">Featured Video</p>
    </div>
  );
}

// 'use client';

// export default function MediaGallery() {
//   const media = [
//     { type: 'image', url: '/assets/ruth-1.jpg' },
//     { type: 'image', url: '/assets/ruth-2.jpg' },
//     { type: 'video', url: '/assets/ruth-video.mp4' },
//   ];

//   return (
//     <div className="my-4">
//       <div className="grid grid-cols-2 gap-1 bg-gray-200 border-y border-gray-200">
//         {/* Main large image or video */}
//         <div className="col-span-2 h-96 overflow-hidden">
//           <video controls className="w-full h-full object-cover">
//             <source src="/assets/ruth-video.mp4" type="video/mp4" />
//           </video>
//         </div>

//         {/* Smaller images below */}
//         <div className="h-48 overflow-hidden">
//           <img
//             src="/assets/ruth-1.jpg"
//             className="w-full h-full object-cover hover:opacity-90 cursor-pointer"
//           />
//         </div>
//         <div className="h-48 overflow-hidden">
//           <img
//             src="/assets/ruth-2.jpg"
//             className="w-full h-full object-cover hover:opacity-90 cursor-pointer"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
