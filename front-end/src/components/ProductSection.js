import React, { useState, useEffect, useRef } from 'react';
import './ProductSection.css';
import Panaromic from './Panaromic.png'
import CarbonFiber from './CarbonFibre.jpeg'
import ProductHero from './ProductHero.mp4'
import VertiPort from './Vertiport.jpeg'


const ProductSection = () => {
    const [isVisible, setIsVisible] = useState({});
    const [activeFeature, setActiveFeature] = useState(0);

    // Use refs for performance-critical mutable values to avoid re-renders
    const sectionRefs = useRef({});
    const cursorRef = useRef(null);
    const showcaseBgRefs = useRef([]);
    const scrollRef = useRef(0);
    const featureInterval = useRef(null);
    const featurePaused = useRef(false);
    const videoRef = useRef(null);

    // Product data
    const product = {
        name: 'Shunya One',
        tagline: 'Modular eVTOL Aircraft',
        heroSubtitle: 'Mountains and skies yield to flight,\nthe future of mobility takes flight.',
        company: 'FlyHive Technologies',
        safetyStats: [
            { label: 'Flight Control', value: '3', unit: 'Redundancy', icon: 'flightControl' },
            { label: 'Power System', value: '2', unit: 'Redundancy', icon: 'power' },
            { label: 'Battery Management', value: '2', unit: 'Redundancy', icon: 'battery' },
            { label: 'Communication', value: '2', unit: 'Redundancy', icon: 'communication' },
            { label: 'Navigation', value: '2', unit: 'Redundancy', icon: 'navigation' },
        ],
        featureCards: [
            {
                id: 'cockpit',
                title: '360° Panoramic View',
                description: 'Made from aerospace-grade polycarbonate with unobstructed visibility for pilots and passengers.',
                image: Panaromic,
            },
            {
                id: 'carbon',
                title: 'Carbon Fiber/Lightweight Excellence',
                description: 'Main structure and rotors crafted from carbon fiber for optimal strength and minimal weight.',
                image: CarbonFiber,
            },
            {
                id: 'climate',
                title: 'Climate Control System',
                description: 'Advanced HVAC system ensures comfortable cabin temperature in all weather conditions.',
                image: '/images/shunya-interior.jpg',
            },
        ],
        specs: [
            { label: 'Max Range', value: '300', unit: 'km' },
            { label: 'Top Speed', value: '200', unit: 'km/h' },
            { label: 'Passengers', value: '6', unit: 'seats' },
            { label: 'Charge Time', value: '30', unit: 'min' },
        ],
        showcaseSections: [
            {
                id: 'modular',
                title: 'Store an "Aircraft" at Your Vertiport',
                subtitle: 'India\'s First Modular eVTOL Design',
                description: 'One-button operation enables seamless configuration changes between passenger and cargo modes within 10 minutes.',
                image: VertiPort,
                alignment: 'center',
            },
            {
                id: 'urban',
                title: '"Urban Air Mobility"\nRedefining City Transport',
                subtitle: 'Skip the traffic, embrace the sky',
                description: 'Designed specifically for India\'s urban environments with whisper-quiet operation and zero emissions.',
                image: Panaromic,
                alignment: 'left',
            },
        ],
        techHighlights: [
            {
                id: 'hybrid',
                title: 'Hybrid-Electric Powertrain',
                description: 'Combining electric efficiency with extended range capability for intercity travel.',
                stats: [
                    { value: '120', unit: 'kWh', label: 'Battery' },
                    { value: '8', unit: 'Motors', label: 'Propulsion' },
                ],
            },
            {
                id: 'autonomous',
                title: 'Autonomous Flight Ready',
                description: 'AI-powered flight control with real-time obstacle detection and emergency protocols.',
                stats: [
                    { value: '360°', unit: 'Sensors', label: 'Coverage' },
                    { value: '99.9', unit: '%', label: 'Reliability' },
                ],
            },
        ],
        detailedSpecs: [
            { label: 'Max Range', value: '300', unit: 'km' },
            { label: 'Top Speed', value: '200', unit: 'km/h' },
            { label: 'Cruise Speed', value: '150', unit: 'km/h' },
            { label: 'Max Altitude', value: '3000', unit: 'm' },
            { label: 'Passengers', value: '6', unit: 'seats' },
            { label: 'Cargo Capacity', value: '200', unit: 'kg' },
            { label: 'Battery', value: '120', unit: 'kWh' },
            { label: 'Charge Time', value: '30', unit: 'min' },
            { label: 'Length', value: '8.5', unit: 'm' },
            { label: 'Wingspan', value: '12.0', unit: 'm' },
            { label: 'Height', value: '3.2', unit: 'm' },
            { label: 'MTOW', value: '1800', unit: 'kg' },
        ],
        timeline: [
            { year: '2023', title: 'Design Complete', status: 'completed' },
            { year: '2024', title: 'Prototype Testing', status: 'current' },
            { year: '2025', title: 'DGCA Certification', status: 'upcoming' },
            { year: '2026', title: 'Commercial Launch', status: 'upcoming' },
        ],
    };

    // Intersection observer: observe static sections + each showcase independently
    useEffect(() => {
        const observers = {};
        const baseSections = ['hero', 'safety', 'features', 'specs', 'timeline', 'cta'];

        baseSections.forEach((section) => {
            observers[section] = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setIsVisible((prev) => ({ ...prev, [section]: true }));
                    }
                },
                { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
            );

            if (sectionRefs.current[section]) {
                observers[section].observe(sectionRefs.current[section]);
            }
        });

        // Observe each showcase section individually so they animate when each becomes visible
        product.showcaseSections.forEach((_, index) => {
            const key = `showcase-${index}`;
            observers[key] = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setIsVisible((prev) => ({ ...prev, [key]: true }));
                    }
                },
                { threshold: 0.18, rootMargin: '0px 0px -60px 0px' }
            );

            if (sectionRefs.current[key]) {
                observers[key].observe(sectionRefs.current[key]);
            }
        });

        return () => {
            Object.values(observers).forEach((observer) => observer.disconnect());
        };
    }, [product.showcaseSections.length]);

    // Throttled scroll handler using requestAnimationFrame to update parallax backgrounds
    useEffect(() => {
        let ticking = false;
        const onScroll = () => {
            scrollRef.current = window.scrollY;
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(() => {
                    const s = scrollRef.current;
                    showcaseBgRefs.current.forEach((el, i) => {
                        if (el) {
                            // small differential per index for depth
                            const depth = 0.12 + (i % 3) * 0.02;
                            el.style.transform = `translate3d(0, ${s * depth}px, 0)`;
                        }
                    });
                    ticking = false;
                });
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        // run once for initial position
        onScroll();

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // When hero becomes visible, allow the browser to fetch and play the video.
    // Video source is not rendered until the hero section is in view (preload='none')
    useEffect(() => {
        if (isVisible.hero && videoRef.current) {
            // If the source is already present React will handle fetching; if not, forcing a load is safe.
            try {
                // attempt to play; some browsers block autoplay without user interaction — ignore promise rejection
                videoRef.current.play?.().catch(() => { });
            } catch (e) {
                // ignore
            }
        }
    }, [isVisible.hero]);

    // Cursor glow: update DOM directly to avoid re-renders
    useEffect(() => {
        const onMove = (e) => {
            const el = cursorRef.current;
            if (!el) return;
            // set with transform for GPU acceleration
            // offset so the center of the glow follows the pointer
            el.style.left = `${e.clientX}px`;
            el.style.top = `${e.clientY}px`;
        };

        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
    }, []);

    // Auto-rotate features - pause on hover
    useEffect(() => {
        const start = () => {
            if (featureInterval.current) clearInterval(featureInterval.current);
            featureInterval.current = setInterval(() => {
                if (!featurePaused.current) {
                    setActiveFeature((prev) => (prev + 1) % product.featureCards.length);
                }
            }, 7000);
        };

        start();
        return () => {
            if (featureInterval.current) clearInterval(featureInterval.current);
        };
    }, [product.featureCards.length]);

    // Add these helper functions to your ProductSection.jsx

    // Utility function to handle spec categories (optional enhancement)
    const getSpecCategory = (label) => {
        const categories = {
            'Performance': ['Max Range', 'Top Speed', 'Cruise Speed', 'Max Altitude'],
            'Capacity': ['Passengers', 'Cargo Capacity'],
            'Power': ['Battery', 'Charge Time'],
            'Dimensions': ['Length', 'Wingspan', 'Height', 'MTOW']
        };

        for (const [category, specs] of Object.entries(categories)) {
            if (specs.includes(label)) return category;
        }
        return 'General';
    };

    // Utility function for number formatting
    const formatSpecValue = (value, unit) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return value;

        // Add thousand separators for large numbers
        if (numValue >= 1000) {
            return numValue.toLocaleString();
        }
        return value;
    };

    // Enhanced safety icon renderer with better accessibility
    const renderSafetyIcon = (iconType) => {
        const icons = {
            flightControl: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                </svg>
            ),
            power: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <rect x="2" y="7" width="16" height="10" rx="2" />
                    <path d="M22 11v2" />
                    <path d="M6 11v2" />
                    <path d="M10 11v2" />
                </svg>
            ),
            battery: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
            ),
            communication: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <circle cx="12" cy="12" r="2" />
                    <path d="M16.24 7.76a6 6 0 0 1 0 8.49" />
                    <path d="M7.76 16.24a6 6 0 0 1 0-8.49" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    <path d="M4.93 19.07a10 10 0 0 1 0-14.14" />
                </svg>
            ),
            navigation: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
            ),
        };
        return icons[iconType] || icons.flightControl;
    };

    // Tech highlight icon renderer
    const renderTechIcon = (iconType) => {
        const icons = {
            hybrid: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
            ),
            autonomous: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            ),
            efficiency: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
            ),
            safety: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                </svg>
            ),
        };
        return icons[iconType] || icons.hybrid;
    };

    return (
        <div className="product-page">
            {/* Cursor Glow Effect - DOM updated directly via ref for performance */}
            <div
                ref={cursorRef}
                className="cursor-glow"
                aria-hidden
                style={{ left: 0, top: 0 }}
            />

            {/* ==================== HERO SECTION ==================== */}
            <section
                ref={(el) => (sectionRefs.current.hero = el)}
                className={`hero-section ${isVisible.hero ? 'hero-section--visible' : ''}`}
                aria-label="Hero"
            >
                <div className="hero-section__bg">
                    <video
                        ref={videoRef}
                        className="hero-section__video"
                        autoPlay
                        muted
                        loop
                        playsInline
                        // do not preload the full video in order to save bandwidth; load only when hero is visible
                        preload="none"
                        poster="/images/shunya-hero-poster.jpg"
                        aria-hidden
                    >
                        {/* Only attach the heavy video source once the hero is visible to avoid early downloads */}
                        {isVisible.hero && <source src={ProductHero} type="video/mp4" />}
                    </video>
                    <div className="hero-section__overlay" />
                    <div className="hero-section__noise" />
                </div>

                {/* Animated Grid Background */}
                <div className="hero-section__grid" aria-hidden>
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="hero-section__grid-line" />
                    ))}
                </div>

                <div className="hero-section__content">
                    <div className="hero-section__badge">
                        <span className="hero-section__badge-dot" />
                        <span className="hero-section__badge-text">{product.company}</span>
                    </div>

                    <h1 className="hero-section__title">
                        <span className="hero-section__title-quote">"</span>
                        <span className="hero-section__title-main">{product.tagline}</span>
                        <span className="hero-section__title-quote">"</span>
                    </h1>

                    <p className="hero-section__subtitle">
                        {product.heroSubtitle.split('\n').map((line, i) => (
                            <span key={i}>
                                {line}
                                <br />
                            </span>
                        ))}
                    </p>
                </div>

                {/* Quick Specs Bar */}
                <div className="hero-section__specs-bar" role="list" aria-label="Quick specs">
                    {product.specs.map((spec, index) => (
                        <div
                            key={index}
                            className="hero-section__spec"
                            role="listitem"
                            style={{ '--delay': `${index * 0.1}s` }}
                        >
                            <span className="hero-section__spec-value">
                                {spec.value}
                                <span className="hero-section__spec-unit">{spec.unit}</span>
                            </span>
                            <span className="hero-section__spec-label">{spec.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ==================== SAFETY SECTION ==================== */}
            <section
                ref={(el) => (sectionRefs.current.safety = el)}
                className={`safety-section ${isVisible.safety ? 'safety-section--visible' : ''}`}
                aria-label="Safety Features"
                aria-describedby="safety-description"
            >
                <div className="safety-section__bg">
                    <div className="safety-section__bg-gradient" aria-hidden="true" />
                </div>

                <div className="safety-section__container">
                    <div className="safety-section__content">
                        <header className="safety-section__header">
                            <span className="safety-section__label">Safety First</span>
                            <h2 className="safety-section__title">
                                Redundant <span className="safety-section__title-highlight">Safety</span> Systems
                            </h2>
                            <p className="safety-section__description" id="safety-description">
                                In case of primary system failure, the backup system seamlessly
                                activates, ensuring multiple layers of safety for every flight.
                            </p>
                        </header>

                        <div className="safety-section__stats-wrapper">
                            <div
                                className="safety-section__stats-grid"
                                role="list"
                                aria-label="Primary safety redundancies"
                            >
                                {product.safetyStats.slice(0, 3).map((stat, index) => (
                                    <article
                                        key={index}
                                        className="safety-stat"
                                        style={{ '--delay': `${index * 0.15}s` }}
                                        role="listitem"
                                        tabIndex={0}
                                        aria-label={`${stat.label}: ${stat.value} ${stat.unit}`}
                                    >
                                        <div className="safety-stat__header">
                                            <span className="safety-stat__icon" aria-hidden="true">
                                                {renderSafetyIcon(stat.icon)}
                                            </span>
                                            <span className="safety-stat__label">{stat.label}</span>
                                        </div>
                                        <div className="safety-stat__value-wrapper">
                                            <span className="safety-stat__value">{stat.value}</span>
                                            <span className="safety-stat__unit">{stat.unit}</span>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            <div
                                className="safety-section__stats-grid safety-section__stats-grid--secondary"
                                role="list"
                                aria-label="Secondary safety redundancies"
                            >
                                {product.safetyStats.slice(3).map((stat, index) => (
                                    <article
                                        key={index}
                                        className="safety-stat"
                                        style={{ '--delay': `${(index + 3) * 0.15}s` }}
                                        role="listitem"
                                        tabIndex={0}
                                        aria-label={`${stat.label}: ${stat.value} ${stat.unit}`}
                                    >
                                        <div className="safety-stat__header">
                                            <span className="safety-stat__icon" aria-hidden="true">
                                                {renderSafetyIcon(stat.icon)}
                                            </span>
                                            <span className="safety-stat__label">{stat.label}</span>
                                        </div>
                                        <div className="safety-stat__value-wrapper">
                                            <span className="safety-stat__value">{stat.value}</span>
                                            <span className="safety-stat__unit">{stat.unit}</span>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="safety-section__visual" aria-hidden="true">
                        <div className="safety-section__shield">
                            <svg
                                viewBox="0 0 200 240"
                                fill="none"
                                className="safety-section__shield-svg"
                                role="img"
                                aria-label="Shield representing safety"
                            >
                                <defs>
                                    <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#CC0000" stopOpacity="0.9" />
                                        <stop offset="50%" stopColor="#990000" stopOpacity="0.7" />
                                        <stop offset="100%" stopColor="#660000" stopOpacity="0.5" />
                                    </linearGradient>
                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                        <feMerge>
                                            <feMergeNode in="coloredBlur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>
                                <path
                                    d="M100 10 L180 50 L180 130 C180 180 100 230 100 230 C100 230 20 180 20 130 L20 50 L100 10Z"
                                    stroke="url(#shieldGradient)"
                                    strokeWidth="2"
                                    fill="none"
                                    filter="url(#glow)"
                                    className="safety-section__shield-outer"
                                />
                                <path
                                    d="M100 30 L160 60 L160 125 C160 165 100 205 100 205 C100 205 40 165 40 125 L40 60 L100 30Z"
                                    stroke="url(#shieldGradient)"
                                    strokeWidth="1.5"
                                    fill="none"
                                    strokeDasharray="8 4"
                                    className="safety-section__shield-inner"
                                />
                                <path
                                    d="M100 50 L140 70 L140 115 C140 145 100 175 100 175 C100 175 60 145 60 115 L60 70 L100 50Z"
                                    stroke="url(#shieldGradient)"
                                    strokeWidth="1"
                                    fill="rgba(204, 0, 0, 0.1)"
                                    className="safety-section__shield-core"
                                />
                            </svg>
                            <div className="safety-section__shield-glow" />
                            <div className="safety-section__shield-center">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M9 12l2 2 4-4" />
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </div>
                            <div className="safety-section__shield-particles">
                                {[...Array(12)].map((_, i) => (
                                    <span
                                        key={i}
                                        className="safety-section__particle"
                                        style={{
                                            '--angle': `${i * 30}deg`,
                                            '--delay': `${i * 0.2}s`,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== FEATURES SECTION ==================== */}
            <section
                ref={(el) => (sectionRefs.current.features = el)}
                className={`features-section ${isVisible.features ? 'features-section--visible' : ''}`}
                aria-label="Features"
            >
                <div className="features-section__container">
                    <div
                        className="features-section__grid"
                        onMouseEnter={() => (featurePaused.current = true)}
                        onMouseLeave={() => (featurePaused.current = false)}
                    >
                        {product.featureCards.map((feature, index) => (
                            <article
                                key={feature.id}
                                className={`feature-card ${activeFeature === index ? 'feature-card--active' : ''}`}
                                style={{ '--delay': `${index * 0.2}s` }}
                                onMouseEnter={() => setActiveFeature(index)}
                            >
                                <div className="feature-card__image-wrapper">
                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        className="feature-card__image"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <div className="feature-card__image-overlay" />
                                </div>
                                <div className="feature-card__content">
                                    <h3 className="feature-card__title">{feature.title}</h3>
                                    <p className="feature-card__description">{feature.description}</p>
                                </div>
                                <div className="feature-card__border" />
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ==================== SHOWCASE SECTIONS ==================== */}
            {product.showcaseSections.map((section, index) => (
                <section
                    key={section.id}
                    ref={(el) => {
                        sectionRefs.current[`showcase-${index}`] = el;
                        showcaseBgRefs.current[index] = el; // store for parallax updates
                    }}
                    className={`showcase-section showcase-section--${section.alignment} ${isVisible[`showcase-${index}`] ? 'showcase-section--visible' : ''}`}
                    aria-label={`Showcase ${section.title}`}
                    // Avoid fetching heavy background images until the section is visible
                    style={{
                        backgroundImage: isVisible[`showcase-${index}`] ? `url(${section.image})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center center',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    {/* Overlay - moved outside of bg div */}
                    <div className="showcase-section__overlay" />

                    <div className="showcase-section__content">
                        <span className="showcase-section__subtitle">{section.subtitle}</span>
                        <h2 className="showcase-section__title">
                            {section.title.split('\n').map((line, i) => (
                                <span key={i}>
                                    {line}
                                    <br />
                                </span>
                            ))}
                        </h2>
                        <p className="showcase-section__description">{section.description}</p>
                        <button className="showcase-section__cta">
                            <span>Learn More</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                                <path d="M5 12H19M19 12L12 5M19 12L12 19" />
                            </svg>
                        </button>
                    </div>
                </section>
            ))}

            {/* ==================== SPECS SECTION ==================== */}
            <section
                ref={(el) => (sectionRefs.current.specs = el)}
                className={`specs-section ${isVisible.specs ? 'specs-section--visible' : ''}`}
                aria-label="Technical Specifications"
                aria-describedby="specs-subtitle"
            >
                <div className="specs-section__bg" aria-hidden="true">
                    <div className="specs-section__bg-pattern" />
                </div>

                <div className="specs-section__container">
                    <header className="specs-section__header">
                        <span className="specs-section__label">Specifications</span>
                        <h2 className="specs-section__title">Technical Excellence</h2>
                        <p className="specs-section__subtitle" id="specs-subtitle">
                            Engineering precision meets sustainable innovation
                        </p>
                    </header>

                    {/* Tech Highlight Cards */}
                    <div className="specs-section__highlights" role="list" aria-label="Key technology highlights">
                        {product.techHighlights.map((highlight, index) => (
                            <article
                                key={highlight.id}
                                className="tech-card"
                                style={{ '--delay': `${index * 0.2}s` }}
                                role="listitem"
                                tabIndex={0}
                            >
                                <div className="tech-card__icon" aria-hidden="true">
                                    {highlight.id === 'hybrid' ? (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M12 6v6l4 2" />
                                            <path d="M16 16l2 2" />
                                            <path d="M8 16l-2 2" />
                                        </svg>
                                    )}
                                </div>
                                <div className="tech-card__content">
                                    <h3 className="tech-card__title">{highlight.title}</h3>
                                    <p className="tech-card__description">{highlight.description}</p>
                                </div>
                                <div className="tech-card__stats" role="list" aria-label={`${highlight.title} statistics`}>
                                    {highlight.stats.map((stat, statIndex) => (
                                        <div
                                            key={statIndex}
                                            className="tech-card__stat"
                                            role="listitem"
                                            aria-label={`${stat.label}: ${stat.value} ${stat.unit}`}
                                        >
                                            <span className="tech-card__stat-value">
                                                {stat.value}
                                                <span className="tech-card__stat-unit">{stat.unit}</span>
                                            </span>
                                            <span className="tech-card__stat-label">{stat.label}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="tech-card__glow" aria-hidden="true" />
                            </article>
                        ))}
                    </div>

                    {/* Detailed Specs Grid */}
                    <div className="specs-section__detailed">
                        <div className="specs-section__detailed-header">
                            <h3>Full Specifications</h3>
                            <button
                                className="specs-section__download"
                                aria-label="Download specifications as PDF"
                                onClick={() => {
                                    // Add download functionality
                                    console.log('Download PDF');
                                }}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                <span>Download PDF</span>
                            </button>
                        </div>

                        <div
                            className="specs-section__grid"
                            role="list"
                            aria-label="Detailed specifications"
                        >
                            {product.detailedSpecs.map((spec, index) => (
                                <div
                                    key={index}
                                    className="spec-item"
                                    style={{ '--delay': `${index * 0.05}s` }}
                                    role="listitem"
                                    tabIndex={0}
                                    aria-label={`${spec.label}: ${spec.value} ${spec.unit}`}
                                >
                                    <span className="spec-item__label">{spec.label}</span>
                                    <span className="spec-item__value">
                                        {spec.value}
                                        <span className="spec-item__unit">{spec.unit}</span>
                                    </span>
                                    <div className="spec-item__line" aria-hidden="true" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            {/* ==================== CTA SECTION ==================== */}
            <section
                ref={(el) => (sectionRefs.current.cta = el)}
                className={`cta-section ${isVisible.cta ? 'cta-section--visible' : ''}`}
                aria-label="Call to action"
            >
                <div className="cta-section__bg">
                    <img
                        src="/images/shunya-cta-bg.jpg"
                        alt="Call to action background"
                        className="cta-section__bg-image"
                        loading="lazy"
                        decoding="async"
                    />
                    <div className="cta-section__overlay" />
                    <div className="cta-section__gradient" />
                </div>

                <div className="cta-section__container">
                    <div className="cta-section__content">
                        <h2 className="cta-section__title">
                            Experience the <span>Future</span> of Flight
                        </h2>
                        <p className="cta-section__description">Be among the first to reserve your seat on the {product.name}</p>

                        <div className="cta-section__actions">
                            <button className="cta-section__btn cta-section__btn--primary">
                                <span>Reserve Now</span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" />
                                </svg>
                            </button>
                            <button className="cta-section__btn cta-section__btn--secondary">Contact Sales</button>
                        </div>

                        <div className="cta-section__trust">
                            <div className="cta-section__trust-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    <path d="M9 12l2 2 4-4" />
                                </svg>
                                <span>DGCA Certified</span>
                            </div>
                            <div className="cta-section__trust-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                                <span>Made in India</span>
                            </div>
                            <div className="cta-section__trust-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 6v6l4 2" />
                                </svg>
                                <span>2026 Delivery</span>
                            </div>
                            <div className="cta-section__trust-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                    <path d="M2 17l10 5 10-5" />
                                    <path d="M2 12l10 5 10-5" />
                                </svg>
                                <span>Zero Emissions</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Newsletter */}
                <div className="cta-section__newsletter">
                    <p>Stay updated on our progress</p>
                    <form className="cta-section__newsletter-form" onSubmit={(e) => e.preventDefault()}>
                        <input type="email" placeholder="Enter your email" className="cta-section__newsletter-input" aria-label="Email address" />
                        <button type="submit" className="cta-section__newsletter-btn">Subscribe</button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default ProductSection;