import styles from "./Navbar.module.css";

function Navbar() {
    return (
        <header>
            <nav className={styles.topNav}>
                <div className={styles.topNavLinks}>
                    <a href="/services">Services & Events</a>
                    <a href="/memo">MECCA Memo</a>
                    <a href="/stores">Stores</a>
                </div>

                <div className={styles.searchBar}>
                    <span className={styles.searchIcon}>🔍</span>
                    Search 150+ global beauty brands
                </div>
            </nav>

            <nav className={styles.mainNav}>
                <button className={styles.menuButton}>☰</button>
                <a href="/" className={styles.logo}>MECCA</a>
                <div className={styles.navIcons}>
                    <a href="/account">👤</a>
                    <a href="/wishlist">❤️</a>
                    <a href="/bag">🛍️</a>
                </div>
            </nav>
            
        </header>
    )
}

export default Navbar;