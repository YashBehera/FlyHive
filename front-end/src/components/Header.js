import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = ({ sections, activeSection, onNavClick, logo = "HIVE" }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    onNavClick(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="header__container">
        {/* Logo - Updated to match the image */}
        <div className="header__logo">
          <span className="header__logo-black">hi</span>
          <span className="header__logo-red">ve</span>
          <span className="header__logo-plus">+</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="header__nav">
          <ul className="header__nav-list">
            {sections.map((section, index) => (
              <li 
                key={section.id} 
                className="header__nav-item"
                style={{ '--item-index': index }}
              >
                <button
                  className={`header__nav-link ${activeSection === section.id ? 'header__nav-link--active' : ''}`}
                  onClick={() => handleNavClick(section.id)}
                >
                  <span className="header__nav-text">{section.name}</span>
                  <span className="header__nav-indicator"></span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA Button */}
        <div className="header__actions">
          <button className="header__cta">
            <span>Reserve Now</span>
            <svg 
              className="header__cta-arrow" 
              viewBox="0 0 24 24" 
              fill="none"
            >
              <path 
                d="M5 12H19M19 12L12 5M19 12L12 19" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            className={`header__mobile-toggle ${isMobileMenuOpen ? 'header__mobile-toggle--open' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="header__hamburger">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`header__mobile-menu ${isMobileMenuOpen ? 'header__mobile-menu--open' : ''}`}>
        {/* Mobile Logo */}
        <div className="header__mobile-logo">
          <span className="header__logo-black">hi</span>
          <span className="header__logo-red">ve</span>
          <span className="header__logo-plus">+</span>
        </div>

        <nav className="header__mobile-nav">
          <ul className="header__mobile-list">
            {sections.map((section, index) => (
              <li 
                key={section.id} 
                className="header__mobile-item"
                style={{ '--item-index': index }}
              >
                <button
                  className={`header__mobile-link ${activeSection === section.id ? 'header__mobile-link--active' : ''}`}
                  onClick={() => handleNavClick(section.id)}
                >
                  <span className="header__mobile-number">0{index + 1}</span>
                  <span className="header__mobile-text">{section.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="header__mobile-footer">
          <button className="header__mobile-cta">
            Reserve Your Flight
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;