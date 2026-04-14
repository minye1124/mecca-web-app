import styles from "./AccountMenu.module.css";
import type { AuthUser } from "../../types/auth";

export interface AccountMenuProps {
    authUser: AuthUser;
    isClosing: boolean;
    onSignOut: () => void;
}

function AccountMenu({ authUser, isClosing, onSignOut }: AccountMenuProps) {
    const greetingName = authUser.firstName || authUser.email.split("@")[0];
    const className = `${styles.accountMenu} ${isClosing ? styles.accountMenuClosing : ""}`;

    return (
        <div className={className}>
            <div className={styles.accountMenuHeader}>
                <p className={styles.accountGreeting}>
                    Hi {greetingName}
                </p>
            </div>
            <div className={styles.accountMenuSection}>
                <button type="button" className={styles.accountMenuItem}>
                    Account details
                </button>
            </div>

            <div className={styles.accountMenuSection}>
                <button type="button" onClick={onSignOut} className={styles.accountMenuItem}>
                    Sign Out
                </button>
            </div>
        </div>
    );
}

export default AccountMenu;