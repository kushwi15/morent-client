import "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-top">
        {/* Left Section: Logo & Description */}
        <div className="footer-logo">
          <h2>MORENT</h2>
          <p>Our vision is to provide convenience and help increase your sales business.</p>
        </div>

        {/* Right Section: Links */}
        <div className="footer-links">
          <div className="footer-column">
            <h4>About</h4>
            <ul>
              <li>How it works</li>
              <li>Featured</li>
              <li>Partnership</li>
              <li>Business Relation</li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Community</h4>
            <ul>
              <li>Events</li>
              <li>Blog</li>
              <li>Podcast</li>
              <li>Invite a friend</li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Socials</h4>
            <ul>
              <li>Discord</li>
              <li>Instagram</li>
              <li>Twitter</li>
              <li>Facebook</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <p>©2022 MORENT. All rights reserved</p>
        <div className="footer-bottom-links">
          <p>Privacy & Policy</p>
          <p>Terms & Condition</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
