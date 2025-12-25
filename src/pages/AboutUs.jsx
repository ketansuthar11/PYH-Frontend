import React from "react";
import Navbar from "../components/Navbar";

function AboutUs() {
    return (
        <>=
            <div className="about-us-container">
                <header className="about-us-header">
                    <h1>About Us</h1>
                    <p>Learn more about our mission, vision, and team.</p>
                </header>

                <section className="about-us-section">
                    <h2>Our Mission</h2>
                    <p>
                        Our mission is to nurture a greener tomorrow by providing healthy, high-quality plants that bring freshness,
                        beauty, and well-being into every home and space — all while growing sustainably and with integrity, just like
                        the roots of nature itself.
                    </p>
                </section>

                <section className="about-us-section">
                    <h2>Our Vision</h2>
                    <p>
                        We envision a world where every community thrives like a flourishing garden, empowered by the
                        joy of plants and the innovation of sustainable practices, spreading greenery and harmony across the globe..
                    </p>
                </section>

                <footer className="about-us-footer">
                    <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
                </footer>
            </div>
        </>
    );
}

export default AboutUs;
