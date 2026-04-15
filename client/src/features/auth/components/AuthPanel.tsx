import styles from "./AuthPanel.module.css";
import { useAuthPanelForm } from "../hooks/useAuthPanelForm";
import CheckEmailStep from "./steps/CheckEmailStep";
import RegisterStep from "./steps/RegisterStep";
import LoginStep from "./steps/LoginStep";
import SlideInPanel from "../../../components/overlay/SlideInPanel";

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
                    <CheckEmailStep {...form.checkEmailStepProps} />
                )}

                {form.step === "login" && (
                    <LoginStep {...form.loginStepProps} />
                )}

                {form.step === "register" && (
                    <RegisterStep {...form.registerStepProps} />
                )}
            </div>
        </SlideInPanel>
    )
}

export default AuthPanel; 