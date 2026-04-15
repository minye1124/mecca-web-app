import styles from "../AuthPanel.module.css";
import FormField from "../../../../components/form/FormField";
import CheckboxField from "../../../../components/form/CheckboxField";
import AuthStepShell from "./AuthStepShell";

type RegisterInputField = {
    key: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: "text" | "email" | "password" | "tel";
}

type RegisterAgreementField = {
    checked: boolean;
    onChange: (value: boolean) => void;
}

export interface RegisterStepProps {
    onBackToCheckEmail: () => void;
    profileFields: RegisterInputField[];
    email: string;
    passwordFields: RegisterInputField[];
    agreements: {
        marketing: RegisterAgreementField;
        terms: RegisterAgreementField;
    };
    buttonLabel: string;
    onSubmit: () => void;
    isBusy: boolean;
}

function RegisterStep({
    onBackToCheckEmail,
    profileFields,
    email,
    passwordFields,
    agreements,
    buttonLabel, onSubmit,
    isBusy
}: RegisterStepProps) {
    const title = "New to MECCA? Join Beauty Loop to test, try and love the best in beauty.";
    const subtitle = (
        <>
            Already signed up? We can't find your account, so maybe
            <button className={styles.linkButton} onClick={onBackToCheckEmail}>
                try another email
            </button>
        </>
    )

    return (
        <AuthStepShell
            title={title}
            subtitle={subtitle}
            submitButtonLabel={buttonLabel}
            onSubmit={onSubmit}
            isBusy={isBusy}
        >
            {profileFields.map(field => (
                <FormField
                    key={field.key}
                    label={field.label}
                    type={field.type}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={field.placeholder}
                    disabled={isBusy}
                />
            ))}

            <FormField
                label="Email address"
                type="email"
                value={email}
                disabled
            />

            {passwordFields.map((field) => (
                <FormField
                    key={field.key}
                    label={field.label}
                    type={field.type}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={field.placeholder}
                    disabled={isBusy}
                />
            ))}

            <CheckboxField
                id="marketing"
                checked={agreements.marketing.checked}
                onChange={agreements.marketing.onChange}
                disabled={isBusy}
            >
                I agree to receive marketing communications such as promotions, offers and updates
            </CheckboxField>

            <CheckboxField
                id="terms"
                checked={agreements.terms.checked}
                onChange={agreements.terms.onChange}
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
        </AuthStepShell>
    );
}

export default RegisterStep;