import React from "react";
import '../assets/styles/Footer.css';

const Footer: React.FC = () => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    return (
        <footer className="footer">
            <div className="footer-grid">
                <div className="footer-section">
                    <h3>About Us</h3>
                    <p>ShopEasy is your one-stop destination for all shopping needs. We strive to provide the best shopping experience with high-quality products.</p>
                    <div className="contact-info">
                        <p><i className="fas fa-phone"></i> +91-9841567455</p>
                        <p><i className="fas fa-envelope"></i> support@shopeasy.com</p>
                    </div>
                </div>
                <div className="footer-section">
                    <h3>Registered Office</h3>
                    <address>
                        ShopEasy Enterprises Ltd.<br />
                        Near Center Street<br />
                        Business Center<br />
                        Maharastra, Nashik 42009<br />
                        India
                    </address>
                </div>
                <div className="footer-section">
                <h3>Consumer Policy</h3>
                    <ul>
                        <li><a href="javascript:void(0)" onClick={handleClick}>Privacy Policy</a></li>
                        <li><a href="javascript:void(0)" onClick={handleClick}>Terms of Use</a></li>
                        <li><a href="javascript:void(0)" onClick={handleClick}>Return Policy</a></li>
                        <li><a href="javascript:void(0)" onClick={handleClick}>Shipping Policy</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="javascript:void(0)" onClick={handleClick}>Products</a></li>
                        <li><a href="javascript:void(0)" onClick={handleClick}>Categories</a></li>
                        <li><a href="javascript:void(0)" onClick={handleClick}>Special Offers</a></li>
                        <li><a href="javascript:void(0)" onClick={handleClick}>My Account</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Connect With Us</h3>
                    <div className="social-links">
                        <a href="javascript:void(0)" onClick={handleClick} title="Facebook" className="facebook">
                            <i className="fa-brands fa-facebook-f"></i>
                        </a>
                        <a href="javascript:void(0)" onClick={handleClick} title="Instagram" className="instagram">
                            <i className="fa-brands fa-instagram"></i>
                        </a>
                        <a href="javascript:void(0)" onClick={handleClick} title="YouTube" className="youtube">
                            <i className="fa-brands fa-youtube"></i>
                        </a>
                        <a href="javascript:void(0)" onClick={handleClick} title="Email" className="email">
                            <i className="fa-solid fa-envelope"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&#169; 2024 ShopEasy. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
