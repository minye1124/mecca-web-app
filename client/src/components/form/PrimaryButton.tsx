import styles from "./PrimaryButton.module.css";

export interface PrimaryButtonProps {
    label: string;
    onClick: () => void;
    disabled?: boolean;
}

function PrimaryButton({ label, onClick, disabled}: PrimaryButtonProps) {
    return (
        <button
            className={styles.primaryButton}
            onClick={onClick}
            disabled={disabled}
        >
            {label}
        </button>
    );
}

export default PrimaryButton;