import Image from 'next/image';

import { ReactElement } from 'react';

import TitleCard from './components/Titlecard';

import Iphone from '@/assets/images/18pro.webp';

const Hero = (): ReactElement => {
  return (
    <section className="relative overflow-hidden bg-red-300 pt-23 pb-0">
      <div className="absolute inset-0 bg-linear-to-r from-[#211C24] to-[#211C24]"></div>
      {/* container */}
      <div className="contentWrapper relative">
        {/* content */}
        <div className="grid grid-cols-1 items-center justify-items-center pt-22 md:grid-cols-2 md:pt-0">
          <div className="order-2">
            <Image quality={100} src={Iphone} alt="iphone18" loading="eager" />
          </div>
          <TitleCard />
        </div>
      </div>
    </section>
  );
};

export default Hero;
