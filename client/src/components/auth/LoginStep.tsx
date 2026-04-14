import styles from "../AuthPanel.module.css";
import FormField from "../form/FormField";
import PrimaryButton from "../form/PrimaryButton";
import Disclaimer from "./Disclaimer";

export interface LoginStepProps {
    email: string;
    password: string;
    onPasswordChange: (value: string) => void;
    onSubmit: () => void;
    isBusy: boolean;
    buttonLabel: string;
}

function LoginStep({ email, password, onPasswordChange, onSubmit, isBusy, buttonLabel }: LoginStepProps) {
    return (
        <>
            <h2 className={styles.title}>Hello! We're so excited to have you here.</h2>
            <p className={styles.subtitle}>Let's get you logged in.</p>

            <FormField
                label="Email address"
                type="email"
                value={email}
                disabled
            />

            <FormField
                label="Password"
                type="password"
                value={password}
                onChange={onPasswordChange}
                placeholder="Password"
                disabled={isBusy}
                onKeyDown={(e) => {
                    if (e.key === "Enter") onSubmit();
                }}
            />

            <div className={styles.forgotPassword}>
                <a href="/forgot-password">Can't remember your password?</a>
            </div>

            <PrimaryButton
                label={buttonLabel}
                onClick={onSubmit}
                disabled={isBusy}
            />

            <Disclaimer />
        </>
    );
}

export default LoginStep;