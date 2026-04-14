import styles from "../AuthPanel.module.css";

function Disclaimer() {
    return (
        <p className={styles.disclaimer}>
            This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
        </p>
    );
}

export default Disclaimer;
