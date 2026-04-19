import type { ReactNode } from "react";
import styles from "./PrimaryButton.module.css";

export interface PrimaryButtonProps {
    label: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    type?: "button" | "submit";
}

function PrimaryButton({ label, onClick, disabled, type = "button" }: PrimaryButtonProps) {
    return (
        <button
            className={styles.primaryButton}
            onClick={onClick}
            disabled={disabled}
            type={type}
        >
            {label}
        </button>
    );
}

export default PrimaryButton;