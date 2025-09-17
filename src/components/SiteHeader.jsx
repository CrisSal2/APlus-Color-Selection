import React from "react";
import "./SiteHeader.css";

export default function SiteHeader() {
  return (
    <header className="site-header">
      {/* Top dark strip */}
      <div className="topbar">
        <div className="topbar-inner">
          <a href="#" className="topbar-center">Orange County Home Remodeling</a>
          <a className="topbar-phone" href="tel:19494582108">949.458.2108</a>
        </div>
      </div>

      {/* Main header */}
      <div className="mainbar">
        <div className="mainbar-inner">
          <a className="logo" href="#" aria-label="A Plus Interior Design and Remodeling">
            {/* Replace with your actual logo */}
            <img src="/logo-aplus.png" alt="A Plus" height="42" />
          </a>

          <nav className="primary-nav" aria-label="Main navigation">
            <ul>
              <li><a href="#">Home</a></li>
              <li className="has-caret"><a href="#">Services</a></li>
              <li><a href="#">Portfolio</a></li>
              <li className="has-caret"><a href="#">About Us</a></li>
              <li><a href="#">Blog</a></li>
              <li><a className="cta" href="#">Schedule a Consultation</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
