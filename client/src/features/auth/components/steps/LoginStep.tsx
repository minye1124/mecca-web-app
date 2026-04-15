import styles from "../AuthPanel.module.css";
import FormField from "../../../../components/form/FormField";
import AuthStepShell from "./AuthStepShell";

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
        </AuthStepShell>
    );
}

export default LoginStep;