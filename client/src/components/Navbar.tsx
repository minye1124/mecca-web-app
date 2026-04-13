import styles from "./Navbar.module.css";
// import { useState, type Dispatch, type SetStateAction } from "react";
import { useState } from "react";
import AuthPanel from "./AuthPanel";
import { AccountIcon, WishlistIcon, BagIcon, SearchIcon } from "./Icons";

type AuthUser = {
    firstName: string;
    lastName: string;
    email: string;
};

interface NavbarProps {
    authUser: AuthUser | null;
    //authToken: string | null;
    onLoginSuccess: ({ user, token }: { user: AuthUser; token: string }) => void;
    onSignOut: () => void;
    // setAuthUser: Dispatch<SetStateAction<AuthUser | null>>;
    // setAuthToken: Dispatch<SetStateAction<string | null>>;
}

function Navbar({ authUser, onLoginSuccess, onSignOut }: NavbarProps) {
    const [showAuthPanel, setShowAuthPanel] = useState(false);
    const [showAccountMenu, setShowAccountMenu] = useState(false);
    const [menuClosing, setMenuClosing] = useState(false);

    const accountNameInitials = authUser
        ? `${authUser.firstName[0] ?? ""}${authUser.lastName[0] ?? ""}`.toUpperCase()
        : "";

    const accountButtonContent = authUser
        ? (<span className={styles.accountAvatar}>{accountNameInitials}</span>)
        : <AccountIcon />;

    const handleLoginSuccess = ({ user, token }: { user: AuthUser; token: string }) => {
        onLoginSuccess({ user, token });
        setShowAccountMenu(false);
        setShowAuthPanel(false);
    }

    const handleAuthPanelLoginSuccess = ({ user, token }: { user: AuthUser; token: string }) => {
        handleLoginSuccess({ user, token });
    }

    const handleSignOut = () => {
        onSignOut();
        setShowAccountMenu(false);
        setShowAuthPanel(false);
    }

    const handleAccountClick = () => {
        if (authUser) {
            setShowAuthPanel(false);
            if (showAccountMenu) {
                setMenuClosing(true);
                setTimeout(() => {
                    setShowAccountMenu(false);
                    setMenuClosing(false);
                }, 200);
            } else {
                setShowAccountMenu(true);
            }
            return;
        }
        setShowAccountMenu(false);
        setShowAuthPanel(true);
    }

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
                    <div className={styles.accountMenuWrapper}>
                        <button onClick={handleAccountClick} className={styles.iconButton} aria-label="Account">
                            {accountButtonContent}
                        </button>

                        {authUser && showAccountMenu && (
                            <div className={`${styles.accountMenu} ${menuClosing ? styles.accountMenuClosing : ""}`}>

                                <div className={styles.accountMenuHeader}>
                                    <p className={styles.accountGreeting}>
                                        Hi {authUser.firstName || authUser.email.split("@")[0]}
                                    </p>                                    
                                </div>

                                <div className={styles.accountMenuSection}>
                                    <button type="button" className={styles.accountMenuItem}>
                                        Account details
                                    </button>
                                </div>

                                <div className={styles.accountMenuSection}>
                                    <button type="button" onClick={handleSignOut} className={styles.accountMenuItem}>
                                        Sign Out
                                    </button>
                                </div>

                            </div>
                        )}
                    </div>

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
                    <span className={styles.searchIcon}>
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

            {showAuthPanel && (
                <AuthPanel
                    onClose={() => setShowAuthPanel(false)}
                    onLoginSuccess={handleAuthPanelLoginSuccess}
                />
            )}
        </header>
    );
}

export default Navbar;
