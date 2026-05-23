import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';

const allSizeOptions = [
  { value: 'XS', label: 'XS', description: 'Extra Small' },
  { value: 'S', label: 'S', description: 'Small' },
  { value: 'M', label: 'M', description: 'Medium' },
  { value: 'L', label: 'L', description: 'Large' },
  { value: 'XL', label: 'XL', description: 'Extra Large' },
  { value: 'XXL', label: 'XXL', description: 'Double XL' },
];

const TShirtSelector = ({
  isOpen,
  onClose,
  onSelect,
  participantName,
  tshirtImages = [],
  tshirtSizes = [],
  tshirtPrice = 30,
}) => {
  // Get available sizes from event data
  const availableSizeOptions = allSizeOptions.filter((opt) => tshirtSizes.includes(opt.value));
  const displayImages = tshirtImages && tshirtImages.length > 0 ? tshirtImages : [];
  const hasImageData = displayImages.length > 0;
  const hasTShirtData = availableSizeOptions.length > 0;
  const [selectedSize, setSelectedSize] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-slide every 3 seconds

  useEffect(() => {
    if (!isOpen || displayImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen, displayImages.length]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    onSelect({
      tshirtId: 1,
      tshirtName: 'Premium Event T-Shirt',
      size: selectedSize,
      price: tshirtPrice,
    });

    setSelectedSize(null);
    setCurrentImageIndex(0);
    onClose();
  };

  const nextImage = () => {
    if (!hasImageData) return;
    setCurrentImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    if (!hasImageData) return;
    setCurrentImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Select T-Shirt</h2>
            {participantName && <p className="mt-1 text-sm text-gray-600">For {participantName}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 md:p-6">
          {!hasTShirtData ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              {/* <div className="mb-4 text-6xl text-gray-300">👕</div> */}
              <h3 className="text-xl font-semibold text-gray-900">T-Shirts Not Available</h3>
              <p className="mt-2 text-gray-600">
                This event does not have T-shirt options configured.
              </p>
              <button
                onClick={onClose}
                className="mt-8 rounded-lg bg-gray-200 px-6 py-2.5 font-medium text-gray-700 transition hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {/* Image Gallery - Clean & Simple */}
              <div className="space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-linear-to-br from-gray-50 via-white to-green-50 shadow-sm">
                  {hasImageData ? (
                    <img
                      src={displayImages[currentImageIndex] || '/img/home/premium.avif'}
                      alt={`T-shirt view ${currentImageIndex + 1}`}
                      onError={(e) => {
                        if (e.currentTarget.src.includes('/img/home/premium.avif')) return;
                        e.currentTarget.src = '/img/home/premium.avif';
                      }}
                      className="h-full w-full object-contain transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-7xl text-gray-300">
                 
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent" />

                  {/* Image Navigation */}
                  {displayImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute top-1/2 left-0 -translate-y-1/2 rounded-full bg-black/45 p-2.5 text-white transition hover:bg-black/70"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute top-1/2 right-0 -translate-y-1/2 rounded-full bg-black/45 p-2.5 text-white transition hover:bg-black/70"
                      >
                        <ChevronRight size={14} />
                      </button>

                      {/* Image Counter */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-sm text-white backdrop-blur-sm">
                        {currentImageIndex + 1} / {displayImages.length}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Product Details - Simple Layout */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Premium Event T-Shirt</h3>
                  <p className="mt-2 text-lg font-semibold text-green-600">${tshirtPrice}</p>
                </div>

                {/* Size Selection */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-gray-900">
                    Select Size
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {availableSizeOptions.length > 0
                      ? availableSizeOptions.map((size) => (
                          <button
                            key={size.value}
                            onClick={() => setSelectedSize(size.value)}
                            className={`rounded-lg border-2 px-1 py-2 text-sm font-semibold transition ${
                              selectedSize === size.value
                                ? 'border-green-500 bg-green-500 text-white shadow-md'
                                : 'border-gray-300 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50'
                            }`}
                          >
                            {size.label}
                          </button>
                        ))
                      : allSizeOptions.map((size) => (
                          <button
                            key={size.value}
                            onClick={() => setSelectedSize(size.value)}
                            className={`rounded-lg border-2 px-1 py-2 text-sm font-semibold transition ${
                              selectedSize === size.value
                                ? 'border-green-500 bg-green-500 text-white shadow-md'
                                : 'border-gray-300 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50'
                            }`}
                          >
                            {size.label}
                          </button>
                        ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={onClose}
                    className="flex-1 rounded-lg border-2 border-gray-300 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={!selectedSize}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-500 py-3 font-semibold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ShoppingBag size={20} />
                    {selectedSize ? `Add Size ${selectedSize}` : 'Add T-Shirt'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TShirtSelector;
