import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { AuthUser, AuthSessionPayload } from '../types/auth';

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

    const login = ({ user, token}: AuthSessionPayload) => {
        setAuthUser(user);
        localStorage.setItem("authUser", JSON.stringify(user));
        localStorage.setItem("authToken", token);
    };

    const signOut = () => {
        setAuthUser(null);
        clearStoredAuthSession();
    };

    useEffect(() => {
        restoreAuthUser();
    }, []);

    useEffect(() => {
        handleAuthCallbackFromUrl();
    }, []);

    function restoreAuthUser() {
        const storedUser = localStorage.getItem("authUser");
        const storedToken = localStorage.getItem("authToken");

        if (!storedUser || !storedToken) return;

        try {
            const user = JSON.parse(storedUser) as AuthUser;
            setAuthUser(user);
        } catch {
            clearStoredAuthSession();
        }
    }

    function clearStoredAuthSession() {
        localStorage.removeItem("authUser");
        localStorage.removeItem("authToken");
    }

    function handleAuthCallbackFromUrl() {
        const searchParams = new URLSearchParams(window.location.search);
        const firstName = searchParams.get("firstName");
        const lastName = searchParams.get("lastName");
        const email = searchParams.get("email");
        const token = searchParams.get("token");

        if (!token || !email) return;

        login({
            user: {
                firstName: firstName ?? "",
                lastName: lastName ?? "",
                email,
            },
            token
        });

        // Clean up URL to remove auth params
        const url = new URL(window.location.href);
        url.searchParams.delete("firstName");
        url.searchParams.delete("lastName");
        url.searchParams.delete("email");
        url.searchParams.delete("token");
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