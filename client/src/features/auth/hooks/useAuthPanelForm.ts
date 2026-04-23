import { useState } from "react";

import { useAuth } from "../../../context/AuthContext";
import { formatDobInput, toIsoDate } from "../../../utils/date";
import { validateEmailFormat, validateRegisterForm } from "../../../utils/validation";

import { AuthApiError, checkEmailExists, resendConfirmationEmail, login as loginRequest, register as registerRequest } from "../api/auth";
import type { CheckEmailStepProps } from "../components/steps/CheckEmailStep";
import type { CheckEmailInboxStepProps } from "../components/steps/CheckEmailInboxStep";
import type { LoginStepProps } from "../components/steps/LoginStep";
import type { RegisterStepProps } from "../components/steps/RegisterStep";
import { registerErrorMessages } from "../config/registerErrorMessages";
import { createRegisterProfileFields, createRegisterPasswordFields } from "../config/registerFields";

type Step = "inputEmail" | "login" | "register" | "checkEmailInbox";
type Status = "idle" | "checkingEmail" | "registering" | "loggingIn" | "resendingConfirmation";

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
    const [infoMessage, setInfoMessage] = useState<string | null>(null);

    const isBusy = status !== "idle";
    const clearMessages = () => {
        setErrorMessage(null);
        setInfoMessage(null);
    };

    // derived labels
    const nextButtonLabel = status === "checkingEmail" ? "Checking..." : "Next";
    const loginButtonLabel = status === "loggingIn" ? "Logging in..." : "Login";
    const registerButtonLabel =
        status === "registering"
            ? "Creating account..."
            : "Create my account";

    // field handlers
    const handleEmailChange = (value: string) => {
        setEmail(value);
        clearMessages();
    }

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        clearMessages();
    }

    const handleConfirmPasswordChange = (value: string) => {
        setConfirmPassword(value);
        clearMessages();
    }

    const handleReturnToLogin = () => {
        setStep("login");
        clearMessages();
    };

    const handleResendConfirmation = async () => {
        setErrorMessage(null);
        setStatus("resendingConfirmation");

        try {
            const response = await resendConfirmationEmail({ email });
            setInfoMessage(response.message);
        } catch (error) {
            if (error instanceof AuthApiError) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("We couldn't resend the verification email. Please try again.");
            }
        } finally {
            setStatus("idle");
        }
    };

    const handleFirstNameChange = (value: string) => setFirstName(value);
    const handleLastNameChange = (value: string) => setLastName(value);
    const handleMobileChange = (value: string) => setMobile(value);

    const handleDobChange = (value: string) => {
        setDob(formatDobInput(value));
    }

    const handleAgreeMarketingChange = (value: boolean) => setAgreeMarketing(value);
    const handleAgreeTermsChange = (value: boolean) => {
        setAgreeTerms(value);
        clearMessages();
    }

    // submit or navigation
    const finalizeLogin = async () => {
        const loginResponse = await loginRequest({ email, password });
        setErrorMessage(null);
        login({ user: loginResponse.user });
        onClose();
    }

    const handleCheckEmail = async () => {
        setErrorMessage(null);

        if (!validateEmailFormat(email)) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }

        setStatus("checkingEmail");
        try {
            const exists = await checkEmailExists(email);
            setStep(exists ? "login" : "register");
        } catch (error) {
            if (error instanceof AuthApiError) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("We couldn't check your email right now. Please try again.");
            }
        } finally {
            setStatus("idle");
        }
    }

    const handleRegister = async () => {
        setErrorMessage(null);
        const result = validateRegisterForm({
            email,
            firstName,
            lastName,
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
            setErrorMessage(null);
            setStep("checkEmailInbox");
            setPassword("");
            setConfirmPassword("");

        } catch (error) {
            if (error instanceof AuthApiError) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Registration failed. Please check your details and try again.");
            }
        } finally {
            setStatus("idle");
        }
    }

    const handleLogin = async () => {
        setErrorMessage(null);
        setStatus("loggingIn");
        try {
            await finalizeLogin();
        } catch (error) {
            if (error instanceof AuthApiError) {
                setErrorMessage(error.message);
                if (error.code === "EMAIL_NOT_CONFIRMED") {
                    setStep("checkEmailInbox");
                }
            } else {
                setErrorMessage("Invalid email or password. Please try again.");
            }
        } finally {
            setStatus("idle");
        }
    }

    const handleBackToCheckEmail = () => {
        setStep("inputEmail");
        clearMessages();
    }

    const checkEmailStepProps: CheckEmailStepProps = {
        email,
        onEmailChange: handleEmailChange,
        onSubmit: handleCheckEmail,
        isBusy,
        buttonLabel: nextButtonLabel
    };

    const checkEmailInboxStepProps: CheckEmailInboxStepProps = {
        email,
        onSubmit: handleReturnToLogin,
        onResend: handleResendConfirmation,
        isBusy,
        buttonLabel: "Back to login"
    };

    const loginStepProps: LoginStepProps = {
        email,
        password,
        onPasswordChange: handlePasswordChange,
        onSubmit: handleLogin,
        isBusy,
        buttonLabel: loginButtonLabel
    };

    const registerProfileFields = createRegisterProfileFields({
        firstName, lastName, dob, mobile,
        onFirstNameChange: handleFirstNameChange,
        onLastNameChange: handleLastNameChange,
        onDobChange: handleDobChange,
        onMobileChange: handleMobileChange
    });

    const registerPasswordFields = createRegisterPasswordFields({
        password, confirmPassword,
        onPasswordChange: handlePasswordChange,
        onConfirmPasswordChange: handleConfirmPasswordChange
    });

    const registerStepProps: RegisterStepProps = {
        onBackToCheckEmail: handleBackToCheckEmail,
        profileFields: registerProfileFields,
        email,
        passwordFields: registerPasswordFields,
        agreements: {
            marketing: {
                checked: agreeMarketing,
                onChange: handleAgreeMarketingChange
            },
            terms: {
                checked: agreeTerms,
                onChange: handleAgreeTermsChange
            }
        },
        buttonLabel: registerButtonLabel,
        onSubmit: handleRegister,
        isBusy
    };

    return {
        step,
        errorMessage,
        infoMessage,
        checkEmailStepProps,
        checkEmailInboxStepProps,
        loginStepProps,
        registerStepProps,
    };

}