import styles from "./OrderSummaryPanel.module.css";

function OrderSummaryPanel() {
    return (
        <section className={styles.section} aria-label="Order summary">
            <div className={styles.placeholder}>
                <p className={styles.label}>Order summary - coming soon</p>
            </div>
        </section>
    );
}

export default OrderSummaryPanel;