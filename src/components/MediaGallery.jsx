'use client';

export default function MediaGallery() {
  const media = [
    { type: 'image', url: '/assets/ruth-1.jpg' },
    { type: 'image', url: '/assets/ruth-2.jpg' },
    { type: 'video', url: '/assets/ruth-video.mp4' },
  ];

  return (
    <div className="my-4">
      <div className="grid grid-cols-2 gap-1 bg-gray-200 border-y border-gray-200">
        {/* Main large image or video */}
        <div className="col-span-2 h-96 overflow-hidden">
          <video controls className="w-full h-full object-cover">
            <source src="/assets/ruth-video.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Smaller images below */}
        <div className="h-48 overflow-hidden">
          <img
            src="/assets/ruth-1.jpg"
            className="w-full h-full object-cover hover:opacity-90 cursor-pointer"
          />
        </div>
        <div className="h-48 overflow-hidden">
          <img
            src="/assets/ruth-2.jpg"
            className="w-full h-full object-cover hover:opacity-90 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
