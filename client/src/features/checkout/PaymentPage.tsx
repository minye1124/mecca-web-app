import { Link } from "react-router-dom";

import { checkoutPageContent } from "./content";
import { useCheckoutSummary } from "./hooks/useCheckoutSummary";
import { buildPricingLines } from "./utils/pricing";
import Layout from "./components/layout/Layout";
import StepIndicator from "./components/progress/StepIndicator";
import OrderSummaryPanel from "./components/panels/OrderSummaryPanel";
import PaymentPanel from "./components/panels/PaymentPanel";

import styles from "./PaymentPage.module.css";

function PaymentPage() {
    const { data, isLoading, error } = useCheckoutSummary();
    const orderSummary = data ? {
        title: data.title,
        items: data.items,
        pricingLines: buildPricingLines(data.pricing),
        beautyLoopPreview: data.beautyLoopPreview,
    } : null;

    const orderSummaryPanel = isLoading ? (
        <p>Loading order summary...</p>
    ) : error || orderSummary === null ? (
        <p>{error ?? "We couldn't load your order summary."}</p>
    ) : (
        <OrderSummaryPanel summary={orderSummary} />
    );

    return (
        <div className={styles.page}>
            <header className={styles.topBar}>
                <Link to="/" className={styles.logo}>
                    MECCA
                </Link>
            </header>

            <main className={styles.main}>
                <section className={styles.hero}>
                    <h1 className={styles.title}>{checkoutPageContent.title}</h1>
                </section>
                <StepIndicator currentStep="payment" />
                <Layout
                    left={<PaymentPanel />}
                    right={orderSummaryPanel}
                />
            </main>

            <div className={styles.bottomBar} />
        </div>
    );


}

export default PaymentPage;
