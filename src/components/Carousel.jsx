'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Navigation, Pagination, Autoplay } from 'swiper/modules';

export default function Carousel() {
  const images = [
    '/assets/ruth-1.jpg',
    '/assets/ruth-friends-1.jpg',
    '/assets/ruth-friends-2.jpg',
    '/assets/ruth-mom.jpg',
  ];

  return (
    <div className="w-full max-w-2xl mx-auto my-4 px-2 md:px-0">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="rounded-xl overflow-hidden shadow-lg bg-black"
        style={{
          '--swiper-navigation-color': '#fff',
          '--swiper-pagination-color': '#fff',
        }}
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            {/* 🔥 Container */}
            <div className="group relative w-full h-[450px] md:h-[550px] flex items-center justify-center overflow-hidden bg-gray-900">
              {/* 🔥 Blurred Background */}
              <img
                src={img}
                alt=""
                className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 transition-transform duration-700 group-hover:scale-125"
              />

              {/* 🔥 Dark Overlay for better contrast */}
              <div className="absolute inset-0 bg-black/20"></div>

              {/* 🔥 Main Image (always fully visible) */}
              <img
                src={img}
                alt={`Birthday memory ${index + 1}`}
                className="relative z-10 max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

// 'use client';

// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';

// import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// export default function Carousel() {
//   const images = [
//     '/assets/ruth-1.jpg',
//     '/assets/ruth-friends-1.jpg',
//     '/assets/ruth-friends-2.jpg',
//     '/assets/ruth-mom.jpg',
//   ];

//   return (
//     <div className="w-full max-w-2xl mx-auto my-4 px-2 md:px-0">
//       <Swiper
//         modules={[Navigation, Pagination, Autoplay]}
//         navigation
//         pagination={{ clickable: true }}
//         autoplay={{
//           delay: 3000,
//           disableOnInteraction: false,
//         }}
//         loop={true}
//         className="rounded-xl overflow-hidden shadow-lg bg-black"
//         style={{
//           '--swiper-navigation-color': '#fff',
//           '--swiper-pagination-color': '#fff',
//         }}
//       >
//         {images.map((img, index) => (
//           <SwiperSlide key={index}>
//             {/* 1. Fixed height container to stop the "jumping" or over-stretching */}
//             <div className="relative w-full h-[450px] md:h-[550px] flex items-center justify-center overflow-hidden bg-gray-900">
//               {/* 2. Blurred background: This fills the 'empty' space for portrait photos */}
//               <img
//                 src={img}
//                 alt=""
//                 className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110"
//               />

//               {/* 3. The actual photo: 'object-contain' ensures Ruth is NEVER cut off */}
//               <img
//                 src={img}
//                 alt={`Birthday memory ${index + 1}`}
//                 className="relative z-10 max-w-full max-h-full object-contain shadow-2xl"
//               />
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// }
