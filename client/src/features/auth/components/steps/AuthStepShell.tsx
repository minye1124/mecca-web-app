import type { ReactNode } from "react";

import PrimaryButton from "../../../../components/form/PrimaryButton";
import Disclaimer from "./Disclaimer";

import styles from "../AuthPanel.module.css";
import Spinner from "../../../../components/form/Spinner";

export interface AuthStepShellProps {
    title: string;
    subtitle: ReactNode;
    submitButtonLabel: string;
    onSubmit: () => void;
    isBusy: boolean;
    children: ReactNode;
}

function AuthStepShell({ title, subtitle, submitButtonLabel, onSubmit, isBusy, children }: AuthStepShellProps) {
    const handleSubmit: React.ComponentProps<"form">["onSubmit"] = (event) => {
        event.preventDefault();
        if (isBusy) {
            return;
        }
        onSubmit();
    };
    
    return (
        <form className={styles.form} aria-busy={isBusy} onSubmit={handleSubmit} noValidate>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.subtitle}>{subtitle}</p>

            {children}

            <PrimaryButton
                type="submit"
                label={
                    <span className={styles.buttonContent}>
                        {isBusy ? <Spinner /> : null}
                        <span>{submitButtonLabel}</span>
                    </span>
                }    
                disabled={isBusy}
            />

            <Disclaimer />
        </form>
    );
}

export default AuthStepShell;