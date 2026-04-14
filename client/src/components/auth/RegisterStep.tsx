import styles from "../AuthPanel.module.css";
import FormField from "../form/FormField";
import CheckboxField from "../form/CheckboxField";
import PrimaryButton from "../form/PrimaryButton";
import Disclaimer from "./Disclaimer";


export interface RegisterStepProps {
    onBackToCheckEmail: () => void;
    firstName: string;
    onFirstNameChange: (value: string) => void;
    lastName: string;
    onLastNameChange: (value: string) => void;
    dob: string;
    onDobChange: (value: string) => void;
    mobile: string;
    onMobileChange: (value: string) => void;
    email: string;
    password: string;
    onPasswordChange: (value: string) => void;
    confirmPassword: string;
    onConfirmPasswordChange: (value: string) => void;
    agreeMarketing: boolean;
    onAgreeMarketingChange: (value: boolean) => void;
    agreeTerms: boolean;
    onAgreeTermsChange: (value: boolean) => void;
    buttonLabel: string;
    onSubmit: () => void;
    isBusy: boolean;

}

function RegisterStep({
    onBackToCheckEmail,
    firstName, onFirstNameChange,
    lastName, onLastNameChange,
    dob, onDobChange,
    mobile, onMobileChange,
    email,
    password, onPasswordChange,
    confirmPassword, onConfirmPasswordChange,
    agreeMarketing, onAgreeMarketingChange,
    agreeTerms, onAgreeTermsChange,
    buttonLabel, onSubmit,
    isBusy
}: RegisterStepProps) {
    return (
        <>
            <h2 className={styles.title}>New to MECCA? Join Beauty Loop to test, try and love the best in beauty.</h2>
            <p className={styles.subtitle}>Already signed up? We can't find your account, so maybe
                <button className={styles.linkButton}
                    onClick={onBackToCheckEmail}
                >
                    try another email
                </button>
            </p>

            <FormField
                label="First name"
                value={firstName}
                onChange={onFirstNameChange}
                placeholder="First name"
                disabled={isBusy}
            />

            <FormField
                label="Last name"
                value={lastName}
                onChange={onLastNameChange}
                placeholder="Last name"
                disabled={isBusy}
            />

            <FormField
                label="Date of birth (optional)"
                value={dob}
                onChange={onDobChange}
                placeholder="Date of birth (optional)"
                disabled={isBusy}
            />

            <FormField
                label="Mobile number (optional)"
                type="tel"
                value={mobile}
                onChange={onMobileChange}
                placeholder="Mobile number (optional)"
                disabled={isBusy}
            />

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
            />

            <FormField
                label="Confirm password"
                type="password"
                value={confirmPassword}
                onChange={onConfirmPasswordChange}
                placeholder="Confirm password"
                disabled={isBusy}
            />

            <CheckboxField
                id="marketing"
                checked={agreeMarketing}
                onChange={onAgreeMarketingChange}
                disabled={isBusy}
            >
                I agree to receive marketing communications such as promotions, offers and updates
            </CheckboxField>

            <CheckboxField
                id="terms"
                checked={agreeTerms}
                onChange={onAgreeTermsChange}
                onKeyDown={(e) => {
                    if (e.key === "Enter") onSubmit();
                }}
                disabled={isBusy}
            >
                I confirm that I have read and accepted the{" "}
                <a href="/terms">MECCA's Terms & Conditions</a>,{" "}
                <a href="/terms">Beauty Loop Terms & Conditions</a> and{" "}
                <a href="/privacy">Privacy Policy</a>.
            </CheckboxField>

            <PrimaryButton 
                label={buttonLabel}
                onClick={onSubmit}
                disabled={isBusy}
            />

            <Disclaimer />
        </>
    );
}

export default RegisterStep;