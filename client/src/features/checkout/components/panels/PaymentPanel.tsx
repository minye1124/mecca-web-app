import styles from "./PaymentPanel.module.css";

function PaymentPanel() {
    return (
        <section className={styles.section} aria-label="Payment details">
            <div className={styles.placeholder}>
                <p className={styles.label}>Payment form - coming soon</p>
            </div>
        </section>
    );
}

export default PaymentPanel;