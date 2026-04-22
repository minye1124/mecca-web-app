import styles from "./Spinner.module.css";

export interface SpinnerProps {
    size?: "sm" | "md";
}

function Spinner({ size = "sm" }: SpinnerProps) {
    return (
        <span
            className={`${styles.spinner} ${size === "md" ? styles.medium : styles.small}`}
            aria-hidden="true"
        />
    );
}

export default Spinner;
