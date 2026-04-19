import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getCurrentUser, logout } from "../features/auth/api/auth";
import type { AuthUser, AuthSessionPayload } from "../types/auth";

type AuthContextValue = {
    authUser: AuthUser | null;
    login: (payload: AuthSessionPayload) => void;
    signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
    children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const [authUser, setAuthUser] = useState<AuthUser | null>(null);

    const login = ({ user }: AuthSessionPayload) => {
        setAuthUser(user);
    };

    const signOut = async () => {
        try {
            await logout();
        } finally {
            setAuthUser(null);
        }
    };

    useEffect(() => {
        void restoreAuthUser();
    }, []);

    useEffect(() => {
        handleAuthCallbackFromUrl();
    }, []);

    async function restoreAuthUser() {
        try {
            const response = await getCurrentUser();
            setAuthUser(response.user);
        } catch {
            setAuthUser(null);
        }
    }

    function handleAuthCallbackFromUrl() {
        const searchParams = new URLSearchParams(window.location.search);
        const error = searchParams.get("error");

        if (!error) return;

        // Clean up URL to remove auth params
        const url = new URL(window.location.href);
        url.searchParams.delete("error");
        window.history.replaceState(
            {}, 
            document.title, 
            `${url.pathname}${url.search}${url.hash}`
        );
    }

    const authContextValue: AuthContextValue = {
        authUser,
        login,
        signOut
    };
    
    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}