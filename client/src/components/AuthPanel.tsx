import styles from "./AuthPanel.module.css";
import { useAuthPanelForm } from "../hooks/useAuthPanelForm";
import CheckEmailStep from "./auth/CheckEmailStep";
import RegisterStep from "./auth/RegisterStep";
import LoginStep from "./auth/LoginStep";
import SlideInPanel from "./overlay/SlideInPanel";

interface AuthPanelProps {
    onClose: () => void;
}

function AuthPanel({ onClose }: AuthPanelProps) {
    const form = useAuthPanelForm({ onClose });

    return (
        <SlideInPanel side="right" onClose={onClose}>
            <div className={styles.content}>
                {form.errorMessage && (
                    <div className={styles.error}>{form.errorMessage}</div>
                )}

                {form.step === "inputEmail" && (
                    <CheckEmailStep
                        email={form.email}
                        onEmailChange={form.handleEmailChange}
                        onSubmit={form.handleCheckEmail}
                        isBusy={form.isBusy}
                        buttonLabel={form.nextButtonLabel}
                    />
                )}

                {form.step === "login" && (
                    <LoginStep
                        email={form.email}
                        password={form.password}
                        onPasswordChange={form.handlePasswordChange}
                        onSubmit={form.handleLogin}
                        isBusy={form.isBusy}
                        buttonLabel={form.loginButtonLabel}
                    />
                )}

                {form.step === "register" && (
                    <RegisterStep
                        email={form.email}
                        firstName={form.firstName}
                        lastName={form.lastName}
                        dob={form.dob}
                        mobile={form.mobile}
                        password={form.password}
                        confirmPassword={form.confirmPassword}
                        agreeMarketing={form.agreeMarketing}
                        agreeTerms={form.agreeTerms}
                        isBusy={form.isBusy}
                        buttonLabel={form.registerButtonLabel}
                        onFirstNameChange={form.handleFirstNameChange}
                        onLastNameChange={form.handleLastNameChange}
                        onDobChange={form.handleDobChange}
                        onMobileChange={form.handleMobileChange}
                        onPasswordChange={form.handlePasswordChange}
                        onConfirmPasswordChange={form.handleConfirmPasswordChange}
                        onAgreeMarketingChange={form.handleAgreeMarketingChange}
                        onAgreeTermsChange={form.handleAgreeTermsChange}
                        onSubmit={form.handleRegister}
                        onBackToCheckEmail={form.handleBackToCheckEmail}
                    />
                )}
            </div>
        </SlideInPanel>
    )
}

export default AuthPanel; 