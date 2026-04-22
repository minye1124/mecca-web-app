import type { ReactNode } from "react";

import styles from "./Layout.module.css";

interface CheckoutLayoutProps {
    left: ReactNode;
    right: ReactNode;
}

function CheckoutLayout({ left, right }: CheckoutLayoutProps) {
    return (
        <div className={styles.layout}>
            <div className={styles.leftColumn}>
                {left}
            </div>
            <div className={styles.rightColumn}>
                {right}
            </div>
        </div>
    );
}

export default CheckoutLayout;