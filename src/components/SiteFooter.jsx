import './SiteFooter.css';

export default function SiteFooter() {
    return (
        <footer className="site-footer">
            <div className="footer-inner">
                {/* Top Block */}
                <section className='contact-block'>
                    <h2 className='footer-title'></h2>


                    <div className='contact-grid'>
                        <div className='contact-left'>
                            <div className='label'>Phone</div>
                            <a className='phone' href="tel:19494582108">949.458.2108</a>
                            <address className='address'>
                                401 E La Palma Ave, Anaheim,<br />
                                CA 92801
                            </address>
                            <div className='social'>
                                <a className='ig' href="https://www.instagram.com/apluskitchens/" aria-label="Instagram">IG</a>
                                <a className='fb' href="https://www.facebook.com/apluskitchens/" aria-label="Facebook">f</a>
                                <a className='yt' href="https://www.youtube.com/@APlusKitchens/videos" aria-label="YouTube">▶</a>
                                <a className='yelp' href="https://www.yelp.com/biz/aplus-interior-design-and-remodeling-anaheim" aria-label="Yelp">y</a>
                                <a className='houzz' href="houzz.com/pro/apluskitchen/aplus-interior-design-remodeling" aria-label="Houzz">h</a>
                                <a className='pin' href="https://www.pinterest.com/aplusremodeling/" aria-label="Pinterest">p</a>
                            </div>
                        </div>
                        <div className='contact-right' />
                    </div>
                </section>


                <hr className='footer-rule' />


                {/* Lower links */}
                <section className='links-grid'>
                    <div className='about'>
                        <div className='section-label'>About Us</div>
                        <p>
                            APlus offers home design-build solutions in Orange County,
                            California. We have extensive experience with kitchen, bathroom
                            and complete home remodels.
                        </p>
                    </div>
                        <nav className="nav-col" aria-label="Footer navigation">
                            <div className="section-label">Navigation</div>
                            <ul>
                                <li><a href="https://www.aplushomeimprovements.com/">Home</a></li>
                                <li><a href="https://www.aplushomeimprovements.com/services/">Services</a></li>
                                <li><a href="https://www.aplushomeimprovements.com/gallery/">Portfolio</a></li>
                                <li><a href="https://www.aplushomeimprovements.com/about-us/">About Us</a></li>
                                <li><a href="https://www.aplushomeimprovements.com/blog/">Blog</a></li>
                            </ul>
                        </nav>
                        <nav className="nav-col" aria-label="Other links">
                            <div className="section-label">Other Links</div>
                            <ul>
                                <li><a href="#">Our Process</a></li>
                                <li><a href="#">Custom Cabinetry</a></li>
                                <li><a href="#">Area We Serve</a></li>
                                <li><a href="#">Awards</a></li>
                                <li><a href="#">Client Testimonials</a></li>
                            </ul>
                        </nav>
                        <div className="youtube-col">
                            <div className="youtube-pill">
                                <span className="play">▶</span>
                                <span className="yt-label">YouTube Channel</span>
                            </div>
                        </div>
                </section>
            </div>
        </footer>
    );
};