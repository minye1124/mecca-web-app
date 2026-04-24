import AuthStepShell from "./AuthStepShell";
import styles from "../AuthPanel.module.css";

export interface ForgotPasswordStepProps {
    email: string;
    onBackToLogin: () => void;
    onBackToCheckEmail: () => void;
    onSubmit: () => void;
    isBusy: boolean;
    buttonLabel: string;
}

function ForgotPasswordStep({
    email,
    onBackToLogin,
    onBackToCheckEmail,
    onSubmit,
    isBusy,
    buttonLabel
}: ForgotPasswordStepProps) {
    const title = "Reset your password";
    const subtitle = (
        <>
            We'll make it easy. Confirm your email address and we'll send you a link with
            instructions.
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
            <p className={styles.secondaryAction}>
                Remember or have reset your password?{" "}
                <button
                    type="button"
                    className={styles.linkButton}
                    onClick={onBackToLogin}
                    disabled={isBusy}
                >
                    Log in here
                </button>
            </p>

            <div className={styles.forgotPasswordFieldGroup}>
                <label className={styles.forgotPasswordFieldLabel}>Email address</label>
                <div className={styles.forgotPasswordEmailRow}>
                    <input
                        className={styles.forgotPasswordEmailInput}
                        type="email"
                        value={email}
                        disabled
                        readOnly
                    />

                    <button
                        type="button"
                        className={styles.editEmailButton}
                        onClick={onBackToCheckEmail}
                        disabled={isBusy}
                        aria-label="Change email"
                    >
                        ✎
                    </button>
                </div>
            </div>
        </AuthStepShell>
    );
}

export default ForgotPasswordStep;
