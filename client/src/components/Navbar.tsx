import styles from "./Navbar.module.css";
import { useState } from "react";
import AuthPanel from "./AuthPanel";
import { AccountIcon, WishlistIcon, BagIcon, SearchIcon } from "./Icons";

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
                        <AccountIcon />
                    </button>
                    <a href="/wishlist" aria-label="Wishlist">
                        <WishlistIcon />
                    </a>
                    <a href="/bag" aria-label="Bag">
                        <BagIcon />
                    </a>
                </div>
            </div>

            {/* Row 2: Search bar */}
            <div className={styles.searchRow}>
                <div className={styles.searchBar}>
                    <span  className={styles.searchIcon}>
                        <SearchIcon />
                    </span>
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

            {showAuth && <AuthPanel onClose={() => setShowAuth(false)} />}
        </header>
    );
}

export default Navbar;
