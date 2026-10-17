'use client';

import Image from 'next/image';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { sliderData } from '@/constant/sliderData';

const BookSlider = () => {
  return (
    <div>
      <Swiper
        modules={[Pagination, Autoplay]}
        className="flex justify-center"
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={600}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
      >
        {sliderData.map((item) => (
          <SwiperSlide key={item.id}>
            <div
              style={{
                backgroundColor: item.bgcolor,
                color: item.color,
              }}
              className="flex flex-col items-center gap-6 pb-14"
            >
              <div className="w-full">
                <Image
                  className="h-60 w-50"
                  src={item.img}
                  width={200}
                  height={200}
                  alt={item.title}
                  quality={100}
                  style={{ justifySelf: item.self }}
                />
              </div>

              <div className="flex w-full flex-col items-start gap-4 px-8 text-center md:px-2 md:text-start">
                <h2 className="w-full font-medium">{item.title}</h2>

                <Link
                  className="self-center rounded-md border bg-transparent px-10 py-2 md:self-start"
                  href=""
                >
                  {item.linkText}
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BookSlider;
