import { useEffect, useState } from "react";
import { confirmEmail, AuthApiError } from "../api/auth";

type Status = "loading" | "success" | "error";

function ConfirmEmailPage() {
    const [status, setStatus] = useState<Status>("loading");
    const [message, setMessage] = useState("Confirming your email...");

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const userId = searchParams.get("userId");
        const token = searchParams.get("token");

        if (!userId || !token) {
            setStatus("error");
            setMessage("Invalid confirmation link.");
            return;
        }

        void handleConfirm(userId, token);
    }, []);

    async function handleConfirm(userId: string, token: string) {
        try {
            const response = await confirmEmail({ userId, token });
            setStatus("success");
            setMessage(response.message);
        } catch (error) {
            setStatus("error");

            if (error instanceof AuthApiError) {
                setMessage(error.message);
            } else {
                setMessage("We couldn't confirm your email. Please try again.");
            }
        }
    }

    return (
        <main style={{ padding: "48px 24px" }}>
            <h1>Email confirmation</h1>
            <p>{message}</p>
            {status === "loading" && <p>Please wait...</p>}
        </main>
    );
}

export default ConfirmEmailPage;