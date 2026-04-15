import PrimaryButton from "../../../../components/form/PrimaryButton";
import styles from "../AuthPanel.module.css";
import Disclaimer from "./Disclaimer";
import type { ReactNode } from "react";

export interface AuthStepShellProps {
    title: string;
    subtitle: ReactNode;
    submitButtonLabel: string;
    onSubmit: () => void;
    isBusy: boolean;
    children: ReactNode;
}

function AuthStepShell({ title, subtitle, submitButtonLabel, onSubmit, isBusy, children }: AuthStepShellProps) {
    return (
        <>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.subtitle}>{subtitle}</p>

            {children}

            <PrimaryButton
                label={submitButtonLabel}
                onClick={onSubmit}
                disabled={isBusy}
            />

            <Disclaimer />
        </>
    );
}

export default AuthStepShell;