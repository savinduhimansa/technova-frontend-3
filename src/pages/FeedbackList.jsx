import React, { useState, useRef, useEffect } from 'react';

const FeedbackList = ({ feedbacks = [] }) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
      checkScroll();
      return () => scrollContainer.removeEventListener('scroll', checkScroll);
    }
  }, [feedbacks]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'bg-[#22C55E] border-[#22C55E] text-white';
    if (rating >= 3) return 'bg-[#FACC15] border-[#FACC15] text-[#1E3A8A]';
    return 'bg-[#EF4444] border-[#EF4444] text-white';
  };

  const getInitials = (name) => {
    if (!name || name === 'Anonymous') return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center min-h-96 w-full bg-gradient-to-br from-[#DBEAFE] via-[#E0ECFF] to-white rounded-3xl text-[#1E3A8A] text-center relative overflow-hidden mx-auto border border-[#BFDBFE] shadow-sm">
      {/* Background pattern - Kept inline due to SVG complexity */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231E3A8A' fill-opacity='0.06'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>
      
      <div className="text-6xl mb-6 animate-bounce">💭</div>
      
      <h3 className="text-3xl font-bold mb-4 text-[#1E40AF]">
        No Reviews Yet
      </h3>
      
      <p className="text-lg text-[#1E3A8A]/90 max-w-md leading-relaxed mb-8 px-4">
        Be the first to share your amazing experience with us! Your feedback helps us grow and serve you better.
      </p>
      
      <div className="px-6 py-3 bg-white/60 rounded-full border border-[#BFDBFE] backdrop-blur-sm text-base font-semibold text-[#1E40AF]">
        ✨ Your story matters to us
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-8 bg-gradient-to-br from-[#DBEAFE] via-[#E0ECFF] to-white rounded-3xl relative overflow-hidden border border-[#BFDBFE] shadow-sm">
      {/* Background decoration - Kept inline due to SVG complexity */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill-opacity='0.05'%3E%3Cpolygon fill='%231E3A8A' points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl">⭐</span>
            <h2 className="text-4xl font-extrabold text-[#1E40AF]">
              What Our Customers Say
            </h2>
            <span className="text-3xl">⭐</span>
          </div>
          <p className="text-lg text-[#1E3A8A] font-medium">
            Real experiences from our amazing customers
          </p>
        </div>

        {feedbacks.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="relative px-12">
            {/* Navigation Buttons */}
            {feedbacks.length > 2 && (
              <>
                <button
                  onClick={() => scroll('left')}
                  disabled={!canScrollLeft}
                  className={`absolute -left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-sm transition-all duration-300 ${
                    canScrollLeft 
                      ? 'bg-[#3B82F6] text-white hover:bg-[#1E40AF]'
                      : 'bg-[#BFDBFE] text-[#1E3A8A]/60 cursor-not-allowed'
                  }`}
                >
                  ←
                </button>
                
                <button
                  onClick={() => scroll('right')}
                  disabled={!canScrollRight}
                  className={`absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-sm transition-all duration-300 ${
                    canScrollRight 
                      ? 'bg-[#3B82F6] text-white hover:bg-[#1E40AF]'
                      : 'bg-[#BFDBFE] text-[#1E3A8A]/60 cursor-not-allowed'
                  }`}
                >
                  →
                </button>
              </>
            )}
            
            {/* Feedback Cards Container */}
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory scrollbar-hide"
            >
              {feedbacks.map((feedback, index) => (
                <div
                  key={feedback._id || index}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`flex-shrink-0 w-80 rounded-2xl p-6 border relative overflow-hidden transition-all duration-500 snap-center ${
                    hoveredCard === index 
                      ? 'scale-105 -translate-y-2 shadow-md bg-[#EAF2FF] border-[#BFDBFE]'
                      : 'shadow-sm bg-[#DBEAFE] border-[#BFDBFE]'
                  } animate-fade-in-scale text-[#1E3A8A]`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Shimmer effect on hover */}
                  {hoveredCard === index && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer opacity-70" />
                  )}
                  
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center text-white font-bold text-base">
                        {getInitials(feedback.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-[#1E40AF] text-base truncate">
                          {feedback.name || 'Anonymous'}
                        </div>
                        <div className="text-sm text-[#1E3A8A]/70">
                          {formatDate(feedback.createdAt)}
                        </div>
                      </div>
                    </div>
                    
                    <div className={`${getRatingColor(feedback.serviceRating)} px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ml-3 border`}>
                      ⭐ {feedback.serviceRating}
                    </div>
                  </div>
                  
                  {/* Star Rating */}
                  <div className="flex gap-1 mb-4 text-xl">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={i < feedback.serviceRating ? 'text-[#FACC15]' : 'text-[#1E3A8A]/30'}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  
                  {/* Comment */}
                  <div className="relative mb-4">
                    <span className="absolute -left-2 -top-2 text-3xl text-[#1E3A8A]/20 font-serif">"</span>
                    <p className="text-sm text-[#1E3A8A]/90 italic pl-5 pr-3">
                      {feedback.comments}
                    </p>
                    <span className="text-3xl text-[#1E3A8A]/20 font-serif">"</span>
                  </div>
                  
                  {/* Verified Badge */}
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-[#EFF6FF] text-[#1E40AF] rounded-full text-xs font-medium border border-[#BFDBFE]">
                    <span className="text-[#1E40AF]">✓</span>
                    Verified Review
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
        .animate-fade-in-scale { animation: fade-in-scale 0.6s ease-out both; }
        .animate-shimmer { animation: shimmer 1.5s infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { scrollbar-width: none; -webkit-overflow-scrolling: touch; }
      `}</style>
    </div>
  );
};

export default FeedbackList;
