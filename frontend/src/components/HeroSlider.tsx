'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Slide {
  title: string;
  subtitle: string;
  eyebrow?: string;
  ctaText?: string;
  ctaLink?: string;
  image?: string;
}

interface HeroSliderProps {
  slides: Slide[];
}

const HeroSlider = ({ slides = [] }: HeroSliderProps) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (!slides || slides.length === 0) return;
    
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [current, slides]);

  const nextSlide = () => {
    if (!slides || slides.length === 0) return;
    setDirection(1);
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (!slides || slides.length === 0) return;
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  if (!slides || slides.length === 0) {
    return (
      <section className="relative h-[72vh] min-h-[560px] overflow-hidden border-b border-[#dddddd] bg-[#f7f7f7] animate-pulse flex items-center justify-center">
        <div className="text-[10px] uppercase tracking-[0.5em] text-gray-400">Lotus & Lion Archive Loading...</div>
      </section>
    );
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  const slide = slides[current];

  if (!slide) return null;

  return (
    <section className="relative h-[60vh] sm:h-[72vh] min-h-[400px] sm:min-h-[560px] overflow-hidden border-b border-[#dddddd] bg-[#f7f7f7]">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 },
          }}
          className="absolute inset-0"
        >
          {slide.image ? (
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="hero-editorial absolute inset-0" />
          )}
          <div className="absolute inset-0 bg-[#1c1c1c]/30" />
          
          <div className="absolute inset-0 z-10 flex items-center justify-center px-8 sm:px-12 text-center text-white">
            <div className="max-w-4xl">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-4 text-[10px] sm:text-[13px] uppercase tracking-[0.32em]"
              >
                {slide.eyebrow}
              </motion.p>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-light uppercase tracking-[0.20em] sm:text-5xl md:text-7xl leading-tight sm:tracking-[0.24em]"
              >
                {slide.title}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mx-auto mt-5 max-w-2xl text-[12px] sm:text-sm leading-relaxed sm:leading-7 opacity-90"
              >
                {slide.subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  href={slide.ctaLink || '/products'}
                  className="mt-8 inline-flex bg-white px-8 sm:px-12 py-3 sm:py-4 text-[10px] sm:text-[12px] uppercase tracking-[0.18em] text-[#1c1c1c] hover:bg-[#1c1c1c] hover:text-white transition-colors"
                >
                  {slide.ctaText || 'Shop Now'}
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-5 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center border border-white/50 text-white hover:bg-white/10 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-5 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center border border-white/50 text-white hover:bg-white/10 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-3">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > current ? 1 : -1);
                  setCurrent(idx);
                }}
                className={`h-1.5 transition-all duration-300 ${
                  current === idx ? 'w-12 bg-white' : 'w-6 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroSlider;
