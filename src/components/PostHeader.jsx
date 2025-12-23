'use client';

export default function PostHeader() {
  return (
    <div className="flex items-center gap-3 mb-4 pt-4">
      <img
        src="/assets/ruth-mom.jpg"
        alt="Ruth's-mom"
        className="w-12 h-12 rounded-full border border-gray-200 object-cover"
      />
      <div>
        <h4 className="font-bold text-gray-900 leading-tight">Ruth's Mommy</h4>
        <div className="flex items-center gap-1 text-gray-500 text-xs">
          <span>Just now</span>
          <span>•</span>
          {/* Simple SVG Globe Icon */}
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M2.04 4.326c.325 1.329 2.532 2.54 3.717 3.19.48.263.793.434.743.484q-.121.12-.242.242a3 3 0 0 0-.441.57c-.161.251-.28.56-.301.973L5.5 10l-.5.5-.5.5c-.25.25-.456.544-.627.857L3.313 13.348A6.97 6.97 0 0 1 1.08 9.088c.05-.444.242-.82.487-1.134.442-.57 1.215-1.281 2.54-2.014m7.415 1.892-1.273.748c-.456.268-.891.735-.906 1.47l-.03.705c-.018.415.117.721.375.937.221.187.583.232.894.209l.49-.035c.178-.012.339-.05.475-.105l.709-.284a2 2 0 0 0 .547-.375l.727-.727a2 2 0 0 0 .188-.181l.68-.943.353-.813a7 7 0 0 0-3.065-1.192" />
          </svg>
        </div>
      </div>
    </div>
  );
}
