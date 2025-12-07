import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Hero.css';
import AirTaxi1 from './AirTaxi2.png'

const Hero = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [isReducedMotion, setIsReducedMotion] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [isPaused, setIsPaused] = useState(false);

    // Split screen slider state
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    
    const heroRef = useRef(null);
    const sliderRef = useRef(null);
    const mediaRef = useRef(null);
    const slideIntervalRef = useRef(null);

    // Left and Right content for split screen (IMAGES ONLY)
    const splitContent = {
        left: {
            image: AirTaxi1,
            label: '',
        },
        right: {
            image: '/images/hero-right.jpg',
            label: 'EH216-S',
        },
    };

    const slides = [
        {
            id: 1,
            headline: 'The Future',
            subline: 'Has Arrived',
            description: 'Experience the dawn of electric air travel with our revolutionary eVTOL aircraft.',
            cta: 'Reserve Your Flight',
            ctaLink: '#reserve',
        },
        {
            id: 2,
            headline: 'Midnight',
            subline: 'Takes Flight',
            description: 'Our flagship aircraft designed for safe, sustainable, and quiet urban air mobility.',
            cta: 'Explore Midnight',
            ctaLink: '#midnight',
        },
        {
            id: 3,
            headline: 'Urban Air',
            subline: 'Mobility',
            description: 'Transforming how you move through cities. Faster and above the traffic.',
            cta: 'Learn More',
            ctaLink: '#learn',
        },
    ];

    // Check for mobile and reduced motion preferences
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        const checkReducedMotion = () => {
            setIsReducedMotion(
                window.matchMedia('(prefers-reduced-motion: reduce)').matches
            );
        };

        checkMobile();
        checkReducedMotion();

        window.addEventListener('resize', checkMobile);

        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        motionQuery.addEventListener('change', checkReducedMotion);

        return () => {
            window.removeEventListener('resize', checkMobile);
            motionQuery.removeEventListener('change', checkReducedMotion);
        };
    }, []);

    // Initial load animation
    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Scroll progress tracking
    useEffect(() => {
        const handleScroll = () => {
            if (!heroRef.current) return;
            const rect = heroRef.current.getBoundingClientRect();
            const progress = Math.min(Math.max(-rect.top / rect.height, 0), 1);
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Auto-advance slides
    useEffect(() => {
        if (isPaused || isReducedMotion) return;

        slideIntervalRef.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);

        return () => {
            if (slideIntervalRef.current) {
                clearInterval(slideIntervalRef.current);
            }
        };
    }, [isPaused, isReducedMotion, slides.length]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                handleSlideLeft();
            } else if (e.key === 'ArrowRight') {
                handleSlideRight();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [sliderPosition]);

    // Mouse/Touch drag handling for slider
    const handleMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
        if (!hasInteracted) setHasInteracted(true);
    };

    // Touch handling for slider
    const handleTouchStart = (e) => {
        if (e.target.closest('.hero-archer__slider-handle') || e.target.closest('.hero-archer__slider-line')) {
            e.preventDefault();
            setIsDragging(true);
            if (!hasInteracted) setHasInteracted(true);
        } else {
            setTouchStart(e.touches[0].clientX);
        }
    };

    const handleTouchEnd = (e) => {
        if (isDragging) {
            setIsDragging(false);
            return;
        }

        if (!touchStart) return;
        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStart - touchEnd;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                goToNextSlide();
            } else {
                goToPrevSlide();
            }
        }
        setTouchStart(null);
    };

    // Add/remove mouse event listeners
    useEffect(() => {
        const handleMouseMoveGlobal = (e) => {
            if (!isDragging || !mediaRef.current) return;

            const rect = mediaRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
            setSliderPosition(percentage);
        };

        const handleTouchMoveGlobal = (e) => {
            if (!isDragging || !mediaRef.current) return;

            const rect = mediaRef.current.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
            setSliderPosition(percentage);
        };

        const handleEnd = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMoveGlobal);
            window.addEventListener('mouseup', handleEnd);
            window.addEventListener('touchmove', handleTouchMoveGlobal);
            window.addEventListener('touchend', handleEnd);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMoveGlobal);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchmove', handleTouchMoveGlobal);
            window.removeEventListener('touchend', handleEnd);
        };
    }, [isDragging]);

    // Slider button handlers
    const handleSlideLeft = () => {
        setSliderPosition(0);
        setHasInteracted(true);
    };

    const handleSlideRight = () => {
        setSliderPosition(100);
        setHasInteracted(true);
    };

    const handleResetSlider = () => {
        setSliderPosition(50);
    };

    // Navigation functions
    const goToSlide = useCallback((index) => {
        setCurrentSlide(index);
        if (slideIntervalRef.current) {
            clearInterval(slideIntervalRef.current);
            slideIntervalRef.current = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
            }, 6000);
        }
    }, [slides.length]);

    const goToNextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const goToPrevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

    // Pause on hover/focus for accessibility
    const handleMouseEnter = () => {
        if (!isMobile) {
            setIsPaused(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isMobile) {
            setIsPaused(false);
        }
    };

    const currentContent = slides[currentSlide];

    return (
        <section
            ref={heroRef}
            className={`hero-archer ${isLoaded ? 'hero-archer--loaded' : ''} ${isMobile ? 'hero-archer--mobile' : ''} ${isReducedMotion ? 'hero-archer--reduced-motion' : ''} ${isDragging ? 'hero-archer--dragging' : ''} ${hasInteracted ? 'hero-archer--interacted' : ''}`}
            style={{ '--scroll-progress': scrollProgress, '--slider-position': `${sliderPosition}%` }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-label="Hero section with split screen comparison"
            role="region"
        >
            {/* Split Screen Background with Interactive Slider */}
            <div
                className="hero-archer__media"
                ref={mediaRef}
            >
                {/* Left Side Image */}
                <div className="hero-archer__split-side hero-archer__split-side--left">
                    <div className="hero-archer__split-content">
                        <div
                            className="hero-archer__image "
                            style={{ backgroundImage: `url(${splitContent.left.image})` }}
                            role="img"
                            aria-label={splitContent.left.label}
                        />
                    </div>
                    {/* Left Side Label */}
                    <div
                        className="hero-archer__split-label hero-archer__split-label--left"
                        onClick={handleSlideLeft}
                        style={{ cursor: 'pointer' }}
                    >
                        <span className="hero-archer__split-label-text">{splitContent.left.label}</span>
                    </div>
                </div>

                {/* Right Side Image */}
                <div className="hero-archer__split-side hero-archer__split-side--right">
                    <div className="hero-archer__split-content">
                        <div
                            className="hero-archer__image"
                            style={{ backgroundImage: `url(${splitContent.right.image})` }}
                            role="img"
                            aria-label={splitContent.right.label}
                        />
                    </div>
                    {/* Right Side Label */}
                    <div
                        className="hero-archer__split-label hero-archer__split-label--right"
                        onClick={handleSlideRight}
                        style={{ cursor: 'pointer' }}
                    >
                        <span className="hero-archer__split-label-text">{splitContent.right.label}</span>
                    </div>
                </div>

                {/* Interactive Slider/Scanner Line */}
                <div
                    className="hero-archer__slider"
                    ref={sliderRef}
                    style={{ left: `${sliderPosition}%` }}
                >
                    {/* Slider Line */}
                    <div
                        className="hero-archer__slider-line"
                        onMouseDown={handleMouseDown}
                        onTouchStart={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsDragging(true);
                            if (!hasInteracted) setHasInteracted(true);
                        }}
                    >
                        <div className="hero-archer__slider-glow"></div>
                    </div>

                    {/* Interaction Hint */}
                    {!hasInteracted && (
                        <div className="hero-archer__slider-hint">
                            <span className="hero-archer__slider-hint-icon">
                                <svg className="hero-archer__slider-hint-arrow hero-archer__slider-hint-arrow--left" viewBox="0 0 24 24" fill="none">
                                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <svg className="hero-archer__slider-hint-arrow hero-archer__slider-hint-arrow--right" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                            <span>Drag to Compare</span>
                        </div>
                    )}

                    {/* Reset Button */}
                    {sliderPosition !== 50 && (
                        <button
                            className="hero-archer__slider-reset"
                            onClick={handleResetSlider}
                            aria-label="Reset slider to center"
                        >
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path
                                    d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M3 3v5h5"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Gradient Overlays */}
                <div className="hero-archer__overlay hero-archer__overlay--gradient"></div>
                <div className="hero-archer__overlay hero-archer__overlay--vignette"></div>
                {!isMobile && (
                    <div className="hero-archer__overlay hero-archer__overlay--noise"></div>
                )}
            </div>

            {/* Skip to content link for accessibility */}
            <a href="#main-content" className="hero-archer__skip-link">
                Skip to main content
            </a>

            {/* Main Content */}
            <div className="hero-archer__container">
                <div className="hero-archer__content">
                    {/* Animated Headlines */}
                    <div className="hero-archer__headlines" aria-live="polite">
                        {slides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className={`hero-archer__headline-group ${currentSlide === index ? 'hero-archer__headline-group--active' : ''}`}
                                aria-hidden={currentSlide !== index}
                            >
                                <h1 className="hero-archer__title">
                                    <span className="hero-archer__title-line">
                                        <span className="hero-archer__title-text">{slide.headline}</span>
                                    </span>
                                    <span className="hero-archer__title-line">
                                        <span className="hero-archer__title-text hero-archer__title-text--outline">
                                            {slide.subline}
                                        </span>
                                    </span>
                                </h1>
                                <p className="hero-archer__description">{slide.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Slide Indicators */}
                <div
                    className="hero-archer__indicators"
                    role="tablist"
                    aria-label="Slide navigation"
                >
                    {slides.map((slide, index) => (
                        <button
                            key={slide.id}
                            className={`hero-archer__indicator ${currentSlide === index ? 'hero-archer__indicator--active' : ''}`}
                            onClick={() => goToSlide(index)}
                            role="tab"
                            aria-selected={currentSlide === index}
                            aria-label={`Slide ${index + 1}: ${slide.headline} ${slide.subline}`}
                            tabIndex={currentSlide === index ? 0 : -1}
                        >
                            <span className="hero-archer__indicator-number" aria-hidden="true">
                                0{index + 1}
                            </span>
                            <span className="hero-archer__indicator-line" aria-hidden="true">
                                <span className="hero-archer__indicator-progress"></span>
                            </span>
                            <span className="hero-archer__indicator-label" aria-hidden="true">
                                {slide.headline}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Navigation Arrows (Mobile) */}
                {isMobile && (
                    <div className="hero-archer__nav-arrows">
                        <button
                            className="hero-archer__nav-arrow hero-archer__nav-arrow--prev"
                            onClick={goToPrevSlide}
                            aria-label="Previous slide"
                        >
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path
                                    d="M15 18L9 12L15 6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                        <button
                            className="hero-archer__nav-arrow hero-archer__nav-arrow--next"
                            onClick={goToNextSlide}
                            aria-label="Next slide"
                        >
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path
                                    d="M9 18L15 12L9 6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Side Info (Desktop only) */}
                {!isMobile && (
                    <div className="hero-archer__side-info">
                        <div className="hero-archer__side-item">
                            <span className="hero-archer__side-label">Aircraft</span>
                            <span className="hero-archer__side-value">Midnight</span>
                        </div>
                        <div className="hero-archer__side-divider"></div>
                        <div className="hero-archer__side-item">
                            <span className="hero-archer__side-label">Status</span>
                            <span className="hero-archer__side-value hero-archer__side-value--status">
                                <span className="hero-archer__status-dot"></span>
                                In Development
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Bar */}
            <div className="hero-archer__bottom-bar">
                <div className="hero-archer__bottom-container">
                    {/* Quick Stats */}
                    <div className="hero-archer__stats" role="list" aria-label="Aircraft specifications">
                        <div className="hero-archer__stat" role="listitem">
                            <span className="hero-archer__stat-value">150+</span>
                            <span className="hero-archer__stat-label">mph</span>
                        </div>
                        <div className="hero-archer__stat-divider" aria-hidden="true"></div>
                        <div className="hero-archer__stat" role="listitem">
                            <span className="hero-archer__stat-value">60</span>
                            <span className="hero-archer__stat-label">mile range</span>
                        </div>
                        <div className="hero-archer__stat-divider" aria-hidden="true"></div>
                        <div className="hero-archer__stat" role="listitem">
                            <span className="hero-archer__stat-value">100%</span>
                            <span className="hero-archer__stat-label">electric</span>
                        </div>
                    </div>

                    {/* Announcement */}
                    <div className="hero-archer__announcement">
                        <span className="hero-archer__announcement-badge" aria-label="New announcement">
                            New
                        </span>
                        <span className="hero-archer__announcement-text">
                            FAA Certification Progress Update
                        </span>
                        <a
                            href="#news"
                            className="hero-archer__announcement-link"
                            aria-label="Read more about FAA Certification Progress Update"
                        >
                            Read More
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path
                                    d="M7 17L17 7M17 7H7M17 7V17"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            {/* Corner Frames (Desktop only) */}
            {!isMobile && (
                <>
                    <div className="hero-archer__frame hero-archer__frame--tl" aria-hidden="true"></div>
                    <div className="hero-archer__frame hero-archer__frame--tr" aria-hidden="true"></div>
                    <div className="hero-archer__frame hero-archer__frame--bl" aria-hidden="true"></div>
                    <div className="hero-archer__frame hero-archer__frame--br" aria-hidden="true"></div>
                </>
            )}

            {/* Progress Bar (Mobile) */}
            {isMobile && (
                <div className="hero-archer__mobile-progress" aria-hidden="true">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            className={`hero-archer__mobile-progress-dot ${currentSlide === index ? 'hero-archer__mobile-progress-dot--active' : ''}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default Hero;
                