import "./SiteHeader.css";
import A_Plus_Logo_dark from "../assets/A_Plus_Logo_dark.png";

export default function SiteHeader() {
  return (
    <header className="site-header">
      {/* Top dark strip */}
      <div className="topbar">
        <div className="topbar-inner">
          <a href="#" className="topbar-center">APlus Interior Design & Remodeling</a>
          <a className="topbar-phone" href="tel:19494582108">949.458.2108</a>
        </div>
      </div>

      {/* Main header */}
      <div className="mainbar">
        <div className="mainbar-inner">
          <a className="logo" href="#" aria-label="A Plus Interior Design and Remodeling">
            <img src={A_Plus_Logo_dark} alt="A Plus" height="42" />
          </a>

          <nav className="primary-nav" aria-label="Main navigation">
            <ul>
              <li><a href="https://www.aplushomeimprovements.com/">Home</a></li>
              <li><a href="https://www.aplushomeimprovements.com/services/">Services</a></li>
              <li><a href="https://www.aplushomeimprovements.com/gallery/">Portfolio</a></li>
              <li><a href="https://www.aplushomeimprovements.com/about-us/">About Us</a></li>
              <li><a href="https://www.aplushomeimprovements.com/blog/">Blog</a></li>
              <li><a className="cta" href="https://www.aplushomeimprovements.com/schedule-a-consultation/">Schedule a Consultation</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
