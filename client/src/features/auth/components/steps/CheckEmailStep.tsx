import { getGoogleLoginUrl } from "../../api/auth";

import { GoogleIcon } from "../AuthIcons";
import AuthTextField from "../AuthTextField";
import AuthStepShell from "./AuthStepShell";

import styles from "../AuthPanel.module.css";

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

            <AuthTextField
                label="Email address"
                type="email"
                value={email}
                onChange={onEmailChange}
                placeholder="Email address"
                disabled={isBusy}
                submitOnEnter={onSubmit}
            />
        </AuthStepShell>
    );
}

export default CheckEmailStep;