import styles from "./Footer.module.css";

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.footerSection}>
                    <h4>Customer Care</h4>
                    <a href="/contact">Help & Contact Us</a>
                    <a href="/shipping">Shipping & Delivery</a>
                    <a href="/returns">Returns & Exchanges</a>
                    <a href="/payment">Payment & Security</a>
                    <a href="/orders">Online Orders</a>
                </div>

                <div className={styles.footerSection}>
                    <h4>About us</h4>
                    <a href="/story">Our Story</a>
                    <a href="/beauty-loop">Beauty Loop</a>
                    <a href="/careers">Careers</a>
                    <a href="/m-power">M-POWER</a>
                    <a href="/m-pact">M-PACT</a>
                    <a href="/meccaversity">MECCAVERSITY</a>
                    <a href="/newsroom">MECCA Newsroom</a>
                </div>

                <div className={styles.footerSection}>
                    <h4>Visit us</h4>
                    <a href="/stores">Store Locator</a>
                    <a href="/services">Services & Events</a>
                    <a href="/flagship">Discover Flagship</a>
                    <a href="/aesthetica">MECCA Aesthetica</a>
                </div>
                
                <div className={styles.footerSection}>
                    <h4>Download the app</h4>
                    <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer">App Store</a>
                    <a href="https://play.google.com" target="_blank" rel="noopener noreferrer">Google Play</a>
                </div>
            </div>

            <div className={styles.footerBottom}>
                <p>MECCA commits to being allies and working in solidarity with First Nations people.</p>
                <p>© 2026 MECCA. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer; 