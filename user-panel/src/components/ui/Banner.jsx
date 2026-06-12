import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BANNERS } from '../../utils/mockData'

export default function Banner() {
  const [current, setCurrent] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % BANNERS.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const prev = () => setCurrent((current - 1 + BANNERS.length) % BANNERS.length)
  const next = () => setCurrent((current + 1) % BANNERS.length)

  const banner = BANNERS[current]

  return (
    <div className="relative rounded-2xl overflow-hidden h-44 sm:h-56 md:h-64 group">
      {/* Banner Slide */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${banner.gradient} transition-all duration-500`}
      >
        <div className="h-full flex items-center px-8 sm:px-12 relative overflow-hidden">
          {/* Text Content */}
          <div className="z-10 max-w-xs sm:max-w-md">
            {banner.tag && (
              <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 backdrop-blur-sm">
                {banner.tag}
              </span>
            )}
            <h2 className="text-2xl sm:text-3xl font-black text-white text-shadow leading-tight">
              {banner.title}
            </h2>
            <p className="text-white/90 text-sm sm:text-base mt-2 mb-4 leading-snug">
              {banner.subtitle}
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn-yellow text-sm px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              {banner.cta} →
            </button>
          </div>

          {/* Emoji decoration */}
          <div className="absolute right-8 sm:right-16 text-7xl sm:text-8xl md:text-9xl opacity-30 select-none">
            {banner.emoji}
          </div>
          <div className="absolute -right-4 top-4 text-4xl opacity-20 rotate-12">
            {banner.emoji}
          </div>
        </div>
      </div>

      {/* Controls */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/50 transition-colors opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/50 transition-colors opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? 'w-6 h-2 bg-white'
                : 'w-2 h-2 bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
