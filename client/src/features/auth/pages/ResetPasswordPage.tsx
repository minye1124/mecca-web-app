import { useState } from "react";

import { validatePasswordFields } from "../../../utils/validation";
import { registerErrorMessages } from "../config/registerErrorMessages";
import { AuthApiError, resetPassword } from "../api/auth";

function ResetPasswordPage() {
    const searchParams = new URLSearchParams(window.location.search);
    const email = searchParams.get("email") ?? "";
    const token = searchParams.get("token") ?? "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isBusy, setIsBusy] = useState(false);

    const hasRequiredParams = email.length > 0 && token.length > 0;

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setMessage(null);
        setErrorMessage(null);

        if (!hasRequiredParams) {
            setErrorMessage("Invalid password reset link.");
            return;
        }

        if (!newPassword || !confirmPassword) {
            setErrorMessage("Please enter and confirm your new password.");
            return;
        }

        const passwordValidation = validatePasswordFields(newPassword, confirmPassword);
        if (passwordValidation.ok === false) {
            setErrorMessage(registerErrorMessages[passwordValidation.code]);
            return;
        }

        setIsBusy(true);

        try {
            const response = await resetPassword({
                email,
                token,
                newPassword
            });

            setMessage(response.message);
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            if (error instanceof AuthApiError) {
                if (error.code in registerErrorMessages) {
                    setErrorMessage(registerErrorMessages[error.code as keyof typeof registerErrorMessages]);
                } else if (error.code === "PASSWORD_SAME_AS_CURRENT") {
                    setErrorMessage("New password must be different from your current password.");
                } else {
                    setErrorMessage(error.message);
                }
            } else {
                setErrorMessage("We couldn't reset your password. Please try again.");
            }
        } finally {
            setIsBusy(false);
        }
    }

    return (
        <main style={{ padding: "48px 24px", maxWidth: "480px" }}>
            <h1>Reset password</h1>

            {message ? (
                <>
                    <p>{message}</p>
                    <p>You can now close this page and continue logging in.</p>
                </>
            ) : (
                <>
                    {errorMessage && <p>{errorMessage}</p>}
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: "16px" }}>
                            <label style={{ display: "block", marginBottom: "4px" }}>Email address</label>
                            <input
                                type="email"
                                value={email}
                                disabled
                                style={{ width: "100%", padding: "12px", boxSizing: "border-box" }}
                            />
                        </div>

                        <div style={{ marginBottom: "16px" }}>
                            <label style={{ display: "block", marginBottom: "4px" }}>New password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(event) => setNewPassword(event.target.value)}
                                disabled={isBusy}
                                style={{ width: "100%", padding: "12px", boxSizing: "border-box" }}
                            />
                        </div>

                        <div style={{ marginBottom: "16px" }}>
                            <label style={{ display: "block", marginBottom: "4px" }}>Confirm new password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                disabled={isBusy}
                                style={{ width: "100%", padding: "12px", boxSizing: "border-box" }}
                            />
                        </div>

                        <button type="submit" disabled={isBusy}>
                            {isBusy ? "Resetting..." : "Reset password"}
                        </button>
                    </form>
                </>
            )}
        </main>
    );
}

export default ResetPasswordPage;
