"use client";
import { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Slide {
  id: number;
  image: string;
  buttonText?: string;
  buttonLink?: string;
}

interface HeroSliderProps {
  slides: Slide[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const delay = 5000; // 5 seconds for slower auto-slide

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () => setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1)),
      delay
    );

    return () => resetTimeout();
  }, [currentIndex, slides.length]);

  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () => setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));

  return (
    <div className="relative w-full h-[70vh] sm:h-[80vh] md:h-[100vh] overflow-hidden ">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={slide.image}
            alt={`Slide ${index + 1}`}
            // className="w-full h-full object-cover object-center bg-gray-100"
            className="absolute top-0 left-0 w-auto h-auto min-w-full min-h-full object-fill"
          />

      
          {slide.buttonText && slide.buttonLink && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
              <a
                href={slide.buttonLink}
                className="bg-white/35 backdrop-blur-sm hover:bg-green-500 hover:text-white italic text-green-700 px-6 py-4 rounded-md text-lg sm:text-xl md:text-2xl font-semibold shadow-lg"
              >
                {slide.buttonText}
              </a>
            </div>
          )}
        </div>
      ))}

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-3xl sm:text-4xl 
             bg-white/20 backdrop-blur-md border border-white/30 
             hover:bg-white/30 p-2 sm:p-3 rounded-full z-20 transition"
      >
        <FaChevronLeft />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-3xl sm:text-4xl 
             bg-white/20 backdrop-blur-md border border-white/30 
             hover:bg-white/30 p-2 sm:p-3 rounded-full z-20 transition"
      >
        <FaChevronRight />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 w-full flex justify-center gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`w-1.5 h-1.5 rounded-full ${
              idx === currentIndex ? "bg-green-600" : "bg-gray-300"
            }`}
            onClick={() => setCurrentIndex(idx)}
          ></button>
        ))}
      </div>
    </div>
  );
}
