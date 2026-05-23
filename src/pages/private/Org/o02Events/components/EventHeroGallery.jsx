import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { resolveImageUrl } from '../../../../../utils/images';
import SpecialCountryFlag from '../../../../../components/common/SpecialCountryFlag';

const EventHeroGallery = ({ images, flag }) => {
  const [activeImg, setActiveImg] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const stripRef = useRef(null);

  const updateScrollButtons = useCallback(() => {
    const el = stripRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateScrollButtons();
    const el = stripRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    const ro = new ResizeObserver(updateScrollButtons);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      ro.disconnect();
    };
  }, [updateScrollButtons]);

  const scrollStrip = (dir) => {
    const el = stripRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 120, behavior: 'smooth' });
  };

  // Normalize images: accept strings or objects with common url/path fields
  const normalized = (images || [])
    .map((it) => {
      if (!it) return null;
      if (typeof it === 'string') return resolveImageUrl(it);
      return resolveImageUrl(it.url || it.path || it.fileUrl || it.src || it.location || null);
    })
    .filter(Boolean);

  // Compute a safe display index without causing state updates inside effects
  const displayIndex = normalized.length === 0 ? 0 : Math.min(activeImg, normalized.length - 1);

  return (
    <div className="flex flex-col gap-3">
      {/* Hero image */}
      <div className="relative overflow-hidden rounded-xl">
        {normalized[displayIndex] ? (
          <img
            src={normalized[displayIndex]}
            alt="Event hero"
            className="aspect-video w-full object-cover sm:aspect-16/10"
          />
        ) : (
          <div className="aspect-video w-full bg-gray-50" aria-hidden="true" />
        )}
        {flag && (
          <div className="absolute top-3 right-3 overflow-hidden rounded shadow">
            <SpecialCountryFlag name={flag} />
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      <div className="relative">
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollStrip(-1)}
            aria-label="Scroll left"
            className="absolute top-1/2 left-1 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow ring-1 ring-gray-200 hover:bg-gray-50"
          >
            <ChevronLeft size={14} />
          </button>
        )}

        <div
          ref={stripRef}
          className="flex gap-2 overflow-x-auto px-1 pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {normalized.map((src, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImg(idx)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all sm:h-20 sm:w-20 lg:h-22.5 lg:w-22.5 ${
                idx === displayIndex
                  ? 'border-green-500 opacity-100 shadow'
                  : 'border-gray-200 opacity-60 hover:opacity-90'
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>

        {canScrollRight && (
          <button
            type="button"
            onClick={() => scrollStrip(1)}
            aria-label="Scroll right"
            className="absolute top-1/2 right-1 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow ring-1 ring-gray-200 hover:bg-gray-50"
          >
            <ChevronRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default EventHeroGallery;
