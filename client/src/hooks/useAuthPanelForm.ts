import { useState } from "react";
import { checkEmailExists, login as loginRequest, register as registerRequest } from "../api/auth";
import { formatDobInput } from "../utils/date";
import { validateRegisterForm, type RegisterFormErrorCode } from "../utils/validation";
import { useAuth } from "../context/AuthContext";
import { toIsoDate } from "../utils/date";

type Step = "inputEmail" | "login" | "register";
type Status =  "idle" | "checkingEmail" | "registering" | "loggingIn" | "loggingInAfterRegister";

const registerErrorMessages: Record<RegisterFormErrorCode, string> = {
    "PASSWORD_MISMATCH": "Passwords do not match. Please try again.",
    "TERMS_NOT_ACCEPTED": "Please confirm that you have read and accepted the terms and conditions."
};

export interface UseAuthPanelFormOptions {
    onClose: () => void;
}

export function useAuthPanelForm({ onClose }: UseAuthPanelFormOptions) {
    const { login } = useAuth();

    const [step, setStep] = useState<Step>("inputEmail");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dob, setDob] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [mobile, setMobile] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [agreeMarketing, setAgreeMarketing] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [status, setStatus] = useState<Status>("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const isBusy = status !== "idle";
    const clearError = () => setErrorMessage(null);

    // derived labels
    const nextButtonLabel = status === "checkingEmail" ? "Checking..." : "Next";
    const loginButtonLabel = status === "loggingIn" ? "Logging in..." : "Login";
    const registerButtonLabel =
        status === "registering"
            ? "Creating account..."
            : status === "loggingInAfterRegister"
                ? "Signing in..."
                : "Create my account";

    // field handlers
    const handleEmailChange = (value: string) => {
        setEmail(value);
        clearError();
    }

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        clearError();
    }

    const handleConfirmPasswordChange = (value: string) => {
        setConfirmPassword(value);
        clearError();
    }

    const handleFirstNameChange = (value: string) => setFirstName(value);
    const handleLastNameChange = (value: string) => setLastName(value);
    const handleMobileChange = (value: string) => setMobile(value);

    const handleDobChange = (value: string) => {
        setDob(formatDobInput(value));
    }

    const handleAgreeMarketingChange = (value: boolean) => setAgreeMarketing(value);
    const handleAgreeTermsChange = (value: boolean) => {
        setAgreeTerms(value);
        clearError();
    }

    // submit or navigation
    const finalizeLogin = async () => {
        const loginResponse = await loginRequest({ email, password });
        setErrorMessage(null);
        login({ user: loginResponse.user, token: loginResponse.token });
        onClose();
    }

    const handleCheckEmail = async () => {
        setErrorMessage(null);
        setStatus("checkingEmail");
        try {
            const exists = await checkEmailExists(email);
            setStep(exists ? "login" : "register");
        } catch {
            setErrorMessage("We couldn't check your email right now. Please try again.");
        } finally {
            setStatus("idle");
        }
    }

    const handleRegister = async () => {
        setErrorMessage(null);
        const result = validateRegisterForm({
            password,
            confirmPassword,
            termsAccepted: agreeTerms
        });

        if (result.ok === false) {
            setErrorMessage(registerErrorMessages[result.code]);
            return;
        }

        setStatus("registering");
        try {
            await registerRequest({
                email,
                password,
                firstName,
                lastName,
                dateOfBirth: toIsoDate(dob),
                phoneNumber: mobile || null,
                agreeMarketing
            });
        } catch {
            setErrorMessage("Registration failed. Please check your details and try again.");
            return;
        }

        // Automatically log in the user after successful registration
        setStatus("loggingInAfterRegister");
        try {
            await finalizeLogin();
        } catch {
            setErrorMessage("Login after registration failed. Please try logging in manually.");
            setStep("login");
        } finally {
            setStatus("idle");
        }
    }

    const handleLogin = async () => {
        setErrorMessage(null);
        setStatus("loggingIn");
        try {
            await finalizeLogin();
        } catch {
            setErrorMessage("Invalid email or password. Please try again.");
        } finally {
            setStatus("idle");
        }
    }

    const handleBackToCheckEmail = () => {
        setStep("inputEmail");
        clearError();
    }

    return {
        // state
        step,
        isBusy,
        errorMessage,

        // field values
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        mobile,
        dob,
        agreeMarketing,
        agreeTerms,

        // button labels
        nextButtonLabel,
        loginButtonLabel,
        registerButtonLabel,

        // field handlers
        handleEmailChange,
        handlePasswordChange,
        handleConfirmPasswordChange,
        handleFirstNameChange,
        handleLastNameChange,
        handleMobileChange,
        handleDobChange,
        handleAgreeMarketingChange,
        handleAgreeTermsChange,

        // submit or navigation
        handleCheckEmail,
        handleRegister,
        handleLogin,
        handleBackToCheckEmail,
    };

}