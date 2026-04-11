import React, { useState } from "react";
import styles from "./AuthPanel.module.css";
import { GoogleIcon } from "./Icons";
import { API_URL } from "../config";

interface AuthPanelProps {
    onClose: () => void;
}
type Step = "inputEmail" | "login" | "register";

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
        let value = e.target.value.replace(/\D/g, "") // Remove non-digit inputs
            .slice(0, 8); // Limit to 8 digits (DDMMYYYY)

        if (value.length >= 4) {
            value = value.slice(0, 2) + "/" + value.slice(2, 4) + "/" + value.slice(4);
        } else if (value.length >= 2) {
            value = value.slice(0, 2) + "/" + value.slice(2);
        }

        setDob(value);
    }

    const handleCheckEmail = async () => {
        const response = await fetch(`${API_URL}/api/auth/check-email?email=${email}`);
        const data = await response.json();
        setStep(data.exists ? "login" : "register");
    }

    const performLogin = async () => {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) return false;

        const data = await response.json();
        console.log("Login successful, token:", data.token);
        onClose();

        return true;
    }

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match. Please try again.");
            return;
        }

        if (!agreeTerms) {
            alert("Please confirm that you have read and accepted the terms and conditions.");
            return;
        }

        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                password,
                firstName,
                lastName,
                dateOfBirth: dob ? new Date(dob.split("/").reverse().join("-")).toISOString() : null,
                phoneNumber: mobile || null
            })
        });

        if (!response.ok) {
            alert("Registration failed. Please check your details and try again.");
            return;
        }

        // Automatically log in the user after successful registration
        const loginSuccess = await performLogin();
        if (!loginSuccess) {
            alert("Login after registration failed. Please try logging in manually.");
            setStep("login");
        }
    }

    const handleLogin = async () => {
        const success = await performLogin();
        if (!success) {
            alert("Invalid email or password. Please try again.");
            return;
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
                                window.location.href = `${API_URL}/api/auth/google-login`;
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