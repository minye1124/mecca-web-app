import { Link } from "react-router-dom";

import Layout from "./components/layout/Layout";
import StepIndicator from "./components/progress/StepIndicator";
import OrderSummaryPanel from "./components/panels/OrderSummaryPanel";
import PaymentPanel from "./components/panels/PaymentPanel";

import styles from "./PaymentPage.module.css";

function PaymentPage() {
    return (
        <div className={styles.page}>
            <header className={styles.topBar}>
                <Link to="/" className={styles.logo}>
                    MECCA
                </Link>
            </header>

            <main className={styles.main}>
                <section className={styles.hero}>
                    <h1 className={styles.title}>Checkout</h1>
                </section>

                <StepIndicator currentStep="payment" />

                <Layout
                    left={<PaymentPanel />}
                    right={<OrderSummaryPanel />}
                />
            </main>

            <div className={styles.bottomBar} />
        </div>
    );
}

export default PaymentPage;
