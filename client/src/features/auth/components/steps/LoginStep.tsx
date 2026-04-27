import FormField from "../../../../components/form/FormField";

import AuthTextField from "../AuthTextField";
import AuthStepShell from "./AuthStepShell";

import styles from "../AuthPanel.module.css";

export interface LoginStepProps {
    email: string;
    password: string;
    onPasswordChange: (value: string) => void;
    onSubmit: () => void;
    onForgotPassword: () => void;
    isBusy: boolean;
    buttonLabel: string;
}

function LoginStep({ email, password, onPasswordChange, onSubmit, onForgotPassword, isBusy, buttonLabel }: LoginStepProps) {
    return (
        <AuthStepShell
            title="Hello! We're so excited to have you here."
            subtitle="Let's get you logged in."
            submitButtonLabel={buttonLabel}
            onSubmit={onSubmit}
            isBusy={isBusy}
        >
            <FormField
                label="Email address"
                type="email"
                value={email}
                disabled
            />

            <AuthTextField
                label="Password"
                type="password"
                value={password}
                onChange={onPasswordChange}
                placeholder="Password"
                disabled={isBusy}
                submitOnEnter={onSubmit}
            />

            <div className={styles.forgotPassword}>
                <button
                    type="button"
                    className={styles.linkButton}
                    onClick={onForgotPassword}
                    disabled={isBusy}
                >
                    Can't remember your password?
                </button>
            </div>
        </AuthStepShell>
    );
}

export default LoginStep;