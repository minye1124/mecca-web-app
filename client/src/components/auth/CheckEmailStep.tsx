import styles from "../AuthPanel.module.css";
import { GoogleIcon } from "../Icons";
import { getGoogleLoginUrl } from "../../api/auth";
import FormField from "../form/FormField";
import PrimaryButton from "../form/PrimaryButton";
import Disclaimer from "./Disclaimer";

export interface CheckEmailStepProps {
    email: string;
    onEmailChange: (value: string) => void;
    onSubmit: () => void;
    isBusy: boolean;
    buttonLabel: string;
}

function CheckEmailStep({ email, onEmailChange, onSubmit, isBusy, buttonLabel }: CheckEmailStepProps) {
    return (
        <>
            <h2 className={styles.title}>Welcome! We're so thrilled to have you here.</h2>
            <p className={styles.subtitle}>
                Pop your email address below. We'll check if there's an existing account, or we can start a new one for you.
            </p>

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

            <PrimaryButton 
                label={buttonLabel}
                onClick={onSubmit}
                disabled={isBusy}
            />

            <Disclaimer />

        </>
    );
}

export default CheckEmailStep;