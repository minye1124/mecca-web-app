import React, { useState } from "react";
import styles from "./AuthPanel.module.css";
import { GoogleIcon } from "./Icons";
import {
    checkEmailExists,
    login as loginRequest,
    register as registerRequest,
    getGoogleLoginUrl
} from "../api/auth";
import { toIsoDate, formatDobInput } from "../utils/date";
import { validateRegisterForm, type RegisterFormErrorCode } from "../utils/validation";

interface AuthPanelProps {
    onClose: () => void;
}
type Step = "inputEmail" | "login" | "register";

const registerErrorMessages: Record<RegisterFormErrorCode, string> = {
    "PASSWORD_MISMATCH": "Passwords do not match. Please try again.",
    "TERMS_NOT_ACCEPTED": "Please confirm that you have read and accepted the terms and conditions."
};

function AuthPanel({ onClose }: AuthPanelProps) {
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

    const disclaimer = (
        <p className={styles.disclaimer}>
            This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
        </p>
    )

    const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDob(formatDobInput(e.target.value));
    }

    const handleCheckEmail = async () => {
        try {
            const exists = await checkEmailExists(email);
            setStep(exists ? "login" : "register");
        } catch {
            alert("We couldn't check your email right now. Please try again.");
        }
    }

    const loginWithCredentials = async () => {
        return loginRequest({ email, password });
    }

    const handleRegister = async () => {
        const result = validateRegisterForm({
            password,
            confirmPassword,
            termsAccepted: agreeTerms
        });

        if (result.ok === false) {
            alert(registerErrorMessages[result.code]);
            return;
        }

        try {
            await registerRequest({
                email,
                password,
                firstName,
                lastName,
                dateOfBirth: toIsoDate(dob),
                phoneNumber: mobile || null
            });
        } catch {
            alert("Registration failed. Please check your details and try again.");
            return;
        }

        // Automatically log in the user after successful registration
        try {
            await loginWithCredentials();
            onClose();
        } catch {
            alert("Login after registration failed. Please try logging in manually.");
            setStep("login");
        }
    }

    const handleLogin = async () => {
        try {
            await loginWithCredentials();
            onClose();
        } catch {
            alert("Invalid email or password. Please try again.");
        }
    }

    return (
        <>
            <div className={styles.overlay} onClick={onClose} />
            <div className={styles.panel}>
                <button className={styles.closeButton} onClick={onClose} aria-label="Close">✕</button>

                <div className={styles.content}>

                    {step === "inputEmail" && (
                        <>
                            <h2 className={styles.title}>Welcome! We're so thrilled to have you here.</h2>
                            <p className={styles.subtitle}>Pop your email address below. We'll check if there's an existing account, or we can start a new one for you.</p>

                            <button className={styles.googleButton} onClick={() => {
                                window.location.href = getGoogleLoginUrl();
                            }}>
                                <GoogleIcon />
                                Continue with Google
                            </button>

                            <p className={styles.divider}>or</p>

                            <div className={styles.inputGroup}>
                                <label>Email address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email address"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleCheckEmail();
                                    }}
                                />
                            </div>
                            <button className={styles.submitButton} onClick={handleCheckEmail}>Next</button>
                            {disclaimer}
                        </>
                    )}

                    {step === "login" && (
                        <>
                            <h2 className={styles.title}>Hello! We're so excited to have you here.</h2>
                            <p className={styles.subtitle}>Let's get you logged in.</p>
                            <div className={styles.inputGroup}>
                                <label>Email address</label>
                                <input type="email" value={email} disabled />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleLogin();
                                    }}
                                />
                            </div>
                            <div className={styles.forgotPassword}>
                                <a href="/forgot-password">Can't remember your password?</a>
                            </div>
                            <button className={styles.submitButton} onClick={handleLogin}>Login</button>
                            {disclaimer}
                        </>
                    )}

                    {step === "register" && (
                        <>
                            <h2 className={styles.title}>New to MECCA? Join Beauty Loop to test, try and love the best in beauty.</h2>
                            <p className={styles.subtitle}>Already signed up? We can't find your account, so maybe <button className={styles.linkButton} onClick={() => setStep("inputEmail")}>try another email</button></p>
                            <div className={styles.inputGroup}>
                                <label>First Name</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="First Name"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Last Name"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Date of Birth (optional)</label>
                                <input
                                    type="text"
                                    value={dob}
                                    onChange={handleDobChange}
                                    placeholder="Date of birth (optional)"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Mobile number (optional)</label>
                                <input
                                    type="tel"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    placeholder="Mobile number (optional)"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Email address</label>
                                <input type="email" value={email} disabled />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm Password"
                                />
                            </div>

                            <div className={styles.checkboxGroup}>
                                <input
                                    type="checkbox"
                                    id="marketing"
                                    checked={agreeMarketing}
                                    onChange={(e) => setAgreeMarketing(e.target.checked)}
                                />
                                <label htmlFor="marketing">I agree to receive marketing communications such as promotions, offers and updates</label>
                            </div>
                            <div className={styles.checkboxGroup}>
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleRegister();
                                    }}
                                />
                                <label htmlFor="terms">I confirm that I have read and accepted the  <a href="/terms">MECCA's Terms & Conditions</a>, <a href="/terms">Beauty Loop Terms & Conditions</a> and <a href="/privacy">Privacy Policy</a>.</label>
                            </div>
                            <button className={styles.submitButton} onClick={handleRegister}>Create my account</button>
                            {disclaimer}
                        </>
                    )}

                </div>
            </div>
        </>
    )
}

export default AuthPanel; 