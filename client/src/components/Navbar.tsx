import styles from "./Navbar.module.css";
import { useState } from "react";
import AuthPanel from "./AuthPanel";

function Navbar() {
    const [showAuth, setShowAuth] = useState(false);

    return (
        <header className={styles.header}>
            {/* Row 1: Secondary links | Logo | Icons */}
            <div className={styles.topRow}>
                <div className={styles.topNavLinks}>
                    <a href="/services">Services & Events</a>
                    <a href="/memo">MECCA Memo</a>
                    <a href="/stores">Stores</a>
                </div>

                <a href="/" className={styles.logo}>MECCA</a>
                <div className={styles.navIcons}>
                    <button onClick={() => setShowAuth(true)} className={styles.iconButton} aria-label="Account">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                        </svg>
                    </button>

                    <a href="/wishlist" aria-label="Wishlist">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                    </a>
                    <a href="/bag" aria-label="Bag">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* Row 2: Search bar */}
            <div className={styles.searchRow}>
                <div className={styles.searchBar}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.searchIcon}>
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search 150+ global beauty brands"
                        className={styles.searchInput}
                    />
                </div>
            </div>

            {/* Row 3: Category navigation */}
            <nav className={styles.categoryNav}>
                <a href="/brands">Brands</a>
                <a href="/new">New</a>
                <a href="/makeup">Makeup</a>
                <a href="/skincare">Skincare</a>
                <a href="/fragrance">Fragrance</a>
                <a href="/haircare">Haircare</a>
                <a href="/body">Body</a>
                <a href="/wellness">Wellness</a>
                <a href="/mens">Men's</a>
                <a href="/gifts">Gifts</a>
                <a href="/edits">Edits</a>
            </nav>

            {showAuth && <AuthPanel onClose={() => setShowAuth(false)}/>}
            {/* {showAuth && <AuthPanel onClose={() => setShowAuth(false)} />} */}
        </header>
    );
}

export default Navbar;
