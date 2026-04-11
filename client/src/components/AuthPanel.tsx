import React, { useState } from "react";
import styles from "./AuthPanel.module.css";
import { GoogleIcon } from "./Icons";

interface AuthPanelProps {
    onClose: () => void;
}
type Step = "inputEmail" | "login" | "register";
const registeredEmails = ["kuroo2177@gmail.com"];

function AuthPanel({ onClose }: AuthPanelProps) {
    const [step, setStep] = useState<Step>("inputEmail");
    const [email, setEmail] = useState("");
    const [dob, setDob] = useState("");

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

                            <button className={styles.googleButton}>
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
                                />
                            </div>
                            <button className={styles.submitButton} onClick={() => {
                                registeredEmails.includes(email) ? setStep("login") : setStep("register")
                            }}>Next</button>
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
                                <input type="password" placeholder="Password" />
                            </div>
                            <div className={styles.forgotPassword}>
                                <a href="/forgot-password">Can't remember your password?</a>
                            </div>
                            <button className={styles.submitButton}>Login</button>
                            {disclaimer}
                        </>
                    )}

                    {step === "register" && (
                        <>
                            <h2 className={styles.title}>New to MECCA? Join Beauty Loop to test, try and love the best in beauty.</h2>
                            <p className={styles.subtitle}>Already signed up? We can't find your account, so maybe <button className={styles.linkButton} onClick={() => setStep("inputEmail")}>try another email</button></p>
                            <div className={styles.inputGroup}>
                                <label>First Name</label>
                                <input type="text" placeholder="First Name" />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Last Name</label>
                                <input type="text" placeholder="Last Name" />
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
                                <input type="tel" placeholder="Mobile number (optional)" />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Email address</label>
                                <input type="email" value={email} disabled />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Password</label>
                                <input type="password" placeholder="Password" />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Confirm Password</label>
                                <input type="password" placeholder="Confirm Password" />
                            </div>

                            <div className={styles.checkboxGroup}>
                                <input type="checkbox" id="marketing" />
                                <label htmlFor="marketing">I agree to receive marketing communications such as promotions, offers and updates</label>
                            </div>
                            <div className={styles.checkboxGroup}>
                                <input type="checkbox" id="terms" />
                                <label htmlFor="terms">I confirm that I have read and accepted the  <a href="/terms">MECCA's Terms & Conditions</a>, <a href="/terms">Beauty Loop Terms & Conditions</a> and <a href="/privacy">Privacy Policy</a>.</label>
                            </div>
                            <button className={styles.submitButton}>Create my account</button>
                            {disclaimer}
                        </>
                    )}

                </div>
            </div>
        </>
    )
}

export default AuthPanel; 