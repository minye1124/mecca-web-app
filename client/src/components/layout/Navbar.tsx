import { useState } from "react";

import AuthPanel from "../../features/auth/components/AuthPanel";
import { useAuth } from "../../context/AuthContext";

import { AccountIcon, WishlistIcon, BagIcon } from "../icons/AppIcons";
import { useAnimatedDisclosure } from "../../hooks/useAnimatedDisclosure";
import AccountMenu from "./navbar/AccountMenu";
import SearchBar from "./navbar/SearchBar";
import CategoryNav from "./navbar/CategoryNav";

import styles from "./Navbar.module.css";

function Navbar() {
    const { authUser, signOut } = useAuth();
    const [showAuthPanel, setShowAuthPanel] = useState(false);
    const accountMenu = useAnimatedDisclosure(200);

    const accountNameInitials = authUser
        ? `${authUser.firstName[0] ?? ""}${authUser.lastName[0] ?? ""}`.toUpperCase()
        : "";

    const accountButtonContent = authUser
        ? (<span className={styles.accountAvatar}>{accountNameInitials}</span>)
        : <AccountIcon />;

    const handleSignOut = () => {
        signOut();
        accountMenu.reset();
        setShowAuthPanel(false);
    }

    const handleAccountClick = () => {
        if (authUser) {
            setShowAuthPanel(false);
            accountMenu.toggle();
            return;
        }
        accountMenu.reset();
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
                        <button 
                            onClick={handleAccountClick}
                            className={styles.iconButton}
                            aria-label="Account"
                        >
                            {accountButtonContent}
                        </button>

                        {authUser && accountMenu.isOpen && (
                            <AccountMenu 
                                authUser={authUser}
                                onSignOut={handleSignOut}
                                isClosing={accountMenu.isClosing}
                            />
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

            <SearchBar />
            <CategoryNav />

            {showAuthPanel && (
                <AuthPanel
                    onClose={() => setShowAuthPanel(false)}
                />
            )}
        </header>
    );
}

export default Navbar;
