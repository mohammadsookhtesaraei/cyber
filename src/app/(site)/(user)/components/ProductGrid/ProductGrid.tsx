import Image from 'next/image';
import Link from 'next/link';

import { ReactElement } from 'react';

import RevealCard from '@/app/(site)/(user)/components/ProductGrid/components/RevalCard';
import ps5Desk from '@/assets/images/PlayStation.webp';
import airpodMobile from '@/assets/images/airpodfull.webp';
import airPodDesk from '@/assets/images/headphone.webp';
import macbookDesk from '@/assets/images/mac.webp';
import macbookMobile from '@/assets/images/macfull.webp';
import ps5Moblie from '@/assets/images/ps5full.webp';
import visMobile from '@/assets/images/visuionfull.webp';
import visDesk from '@/assets/images/visuon.webp';

const ProductGrid = (): ReactElement => {
  return (
    <section className="">
      <div className="flex flex-col md:flex-row">
        {/* right: MacBook */}

        <RevealCard className="group order-2 w-full overflow-hidden bg-[#EDEDED] md:order-1">
          <div className="flex h-full w-full flex-col items-center bg-[#EDEDED] py-11 pr-4 pl-4 transition-transform duration-300 group-hover:scale-105 md:order-1 md:flex-row md:pr-0 md:pl-14">
            <div className="md:hidden">
              <Image
                className="h-auto"
                src={macbookMobile}
                alt="macbook"
                height={200}
                width={330}
                loading="lazy"
              />
            </div>
            <div className="hidden md:block">
              <Image
                className="h-auto"
                src={macbookDesk}
                alt="macbook"
                height={502}
                width={500}
                loading="lazy"
              />
            </div>
            <div className="flex w-full flex-col items-center gap-4 justify-self-end text-left">
              <h2 className="font-sans text-[34px] font-thin text-black md:text-6xl">
                Macbook <span className="font-bold">Air</span>
              </h2>
              <p
                dir="ltr"
                className="text-4 text-center font-sans font-medium text-[#909090] md:text-left md:text-[14px]"
              >
                The new 15‑inch MacBook Air makes room for more of what you love
                with a spacious Liquid Retina display.
              </p>
              <Link
                className="hover:text-primary active:text-primary w-full rounded-md border border-black bg-transparent py-4 text-center text-black transition-all duration-300 hover:bg-white active:bg-white md:w-fit md:self-end md:px-14"
                href="/product"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </RevealCard>

        {/* left */}
        <div className="order-1 flex w-full flex-col overflow-hidden text-left md:order-2">
          {/* top: PS5 */}

          <RevealCard className="group order-2 w-full overflow-hidden bg-white md:order-1">
            <div className="flex h-full w-full flex-col items-center py-10 pr-4 pl-4 transition-transform duration-300 group-hover:scale-105 md:flex-row md:py-0 md:pr-12 md:pl-0">
              <div className="order-2 flex flex-col items-center gap-4 text-center md:order-0">
                <h2 className="font-sans text-[34px] font-medium text-black md:text-6xl">
                  Playstation 5
                </h2>
                <p dir="ltr" className="text-4 text-[#909090] md:text-[14px]">
                  Incredibly powerful CPUs, GPUs, and an SSD with integrated I/O
                  will redefine your PlayStation experience.
                </p>
              </div>
              <div className="hidden w-full justify-end justify-self-end md:flex">
                <Image
                  className="max-w-125.2 h-85.5 object-left"
                  quality={100}
                  src={ps5Desk}
                  alt="ps5"
                  height={324}
                  width={500}
                  loading="lazy"
                />
              </div>
              <div className="order-1 md:hidden">
                <Image
                  className="h-50 max-w-50 object-cover"
                  quality={100}
                  src={ps5Moblie}
                  alt="ps5"
                  height={200}
                  width={200}
                  loading="lazy"
                />
              </div>
            </div>
          </RevealCard>

          {/* bottom */}
          <div className="order-1 flex flex-1 flex-col overflow-hidden md:order-2 md:flex-row">
            {/* AirPods */}

            <RevealCard className="group order-1 w-full overflow-hidden bg-[#EDEDED] md:order-2 md:w-1/2">
              <div className="flex h-full w-full flex-col items-center gap-5 py-10 pr-4 pl-4 text-center transition-transform duration-300 group-hover:scale-105 md:flex-row md:gap-0 md:py-0 md:pr-12 md:pl-0 md:text-left">
                <div className="order-2 flex w-full flex-col gap-2 md:order-0 md:max-w-40">
                  <h2 className="font-sans text-[34px] leading-tight font-thin text-black md:text-[29px]">
                    <span className="md:block md:whitespace-nowrap">Apple</span>
                    <span className="md:block md:whitespace-nowrap">
                      AirPods <span className="font-bold">Max</span>
                    </span>
                  </h2>
                  <p
                    dir="ltr"
                    className="font-sans text-[14px] font-medium text-[#909090]"
                  >
                    Computational audio. <br /> Listen, it&apos;s powerful
                  </p>
                </div>

                <div className="hidden w-full items-center justify-end md:flex">
                  <Image
                    className="h-68 w-full max-w-61.25 object-contain object-left"
                    quality={100}
                    src={airPodDesk}
                    alt="airpod"
                    height={272}
                    width={245}
                    loading="lazy"
                  />
                </div>

                <div className="order-1 md:hidden">
                  <Image
                    className="h-68 w-full max-w-61.25 object-contain object-left"
                    quality={100}
                    src={airpodMobile}
                    alt="airpod"
                    height={200}
                    width={192}
                    loading="lazy"
                  />
                </div>
              </div>
            </RevealCard>

            {/* Vision Pro */}
            <RevealCard className="group order-2 w-full overflow-hidden bg-[#353535] md:order-1 md:w-1/2">
              <div className="flex h-full w-full flex-col items-center gap-4 py-10 pr-4 pl-4 text-center transition-transform duration-300 group-hover:scale-105 md:flex-row md:py-0 md:pr-12 md:pl-0 md:text-left">
                <div className="order-2 flex w-full flex-col gap-2 md:order-0 md:max-w-40">
                  <h2 className="font-sans text-[29px] leading-tight font-thin text-white">
                    <span className="md:block md:whitespace-nowrap">Apple</span>
                    <span className="md:block md:whitespace-nowrap">
                      Vision <span className="font-bold">Pro</span>
                    </span>
                  </h2>
                  <p
                    dir="ltr"
                    className="font-sans text-[14px] font-medium whitespace-nowrap text-[#909090]"
                  >
                    An immersive way to <br /> experience entertainment
                  </p>
                </div>

                <div className="hidden w-full items-center justify-end md:flex">
                  <Image
                    className="h-47.5 w-full max-w-61.25 object-contain object-left"
                    quality={100}
                    src={visDesk}
                    alt="visuon"
                    height={272}
                    width={245}
                    loading="lazy"
                  />
                </div>

                <div className="order-1 flex w-full items-center justify-center md:hidden">
                  <Image
                    className="h-47.5 w-full max-w-81.25 object-contain"
                    quality={100}
                    src={visMobile}
                    alt="visuon"
                    height={192}
                    width={325}
                    loading="lazy"
                  />
                </div>
              </div>
            </RevealCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
