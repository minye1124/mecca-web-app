import AuthStepShell from "./AuthStepShell";
import styles from "../AuthPanel.module.css";

export interface CheckEmailInboxStepProps {
    email: string;
    onSubmit: () => void;
    onResend: () => void;
    isBusy: boolean;
    buttonLabel: string;
}

function CheckEmailInboxStep({ email, onSubmit, onResend, isBusy, buttonLabel }: CheckEmailInboxStepProps) {
    const title = "Check your email";
    const subtitle = (
        <>
            We sent a verification link to <strong>{email}</strong>. Please check your inbox
            and spam folder, then come back once you've verified your address.
        </>
    );

    return (
        <AuthStepShell
            title={title}
            subtitle={subtitle}
            submitButtonLabel={buttonLabel}
            onSubmit={onSubmit}
            isBusy={isBusy}
        >
            <button
                type="button"
                className={styles.linkButton}
                onClick={onResend}
                disabled={isBusy}
            >
                Resend verification email
            </button>
        </AuthStepShell>
    );
}

export default CheckEmailInboxStep;
