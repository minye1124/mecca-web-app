import styles from "../AuthPanel.module.css";
import { GoogleIcon } from "../Icons";
import { getGoogleLoginUrl } from "../../api/auth";
import FormField from "../form/FormField";
import AuthStepShell from "./AuthStepShell";

export interface CheckEmailStepProps {
    email: string;
    onEmailChange: (value: string) => void;
    onSubmit: () => void;
    isBusy: boolean;
    buttonLabel: string;
}

function CheckEmailStep({ email, onEmailChange, onSubmit, isBusy, buttonLabel }: CheckEmailStepProps) {
    return (
        <AuthStepShell
            title="Welcome! We're so thrilled to have you here."
            subtitle="Pop your email address below. We'll check if there's an existing account, or we can start a new one for you."
            submitButtonLabel={buttonLabel}
            onSubmit={onSubmit}
            isBusy={isBusy}
        >
            <button className={styles.googleButton}
                onClick={() => {
                    window.location.href = getGoogleLoginUrl();
                }}>
                <GoogleIcon />
                Continue with Google
            </button>

            <p className={styles.divider}>or</p>

            <FormField
                label="Email address"
                type="email"
                value={email}
                onChange={onEmailChange}
                placeholder="Email address"
                disabled={isBusy}
                onKeyDown={(e) => {
                    if (e.key === "Enter") onSubmit();
                }}
            />
        </AuthStepShell>
    );
}

export default CheckEmailStep;