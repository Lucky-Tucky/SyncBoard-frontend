import { useEffect, useState, useCallback } from "react";
import TokenClass from "../Service/AuthService";

const listeners = new Set();

export const setAuthentication = (val) => {
    listeners.forEach((listener) => {
        try {
            listener(val);
        } catch (e) {
            console.error(e);
        }
    });
};

export default function AuthContext() {
    const [isAuthenticated, setAuthState] = useState(Boolean(TokenClass.getToken()));
    const [isLoading, setIsLoading] = useState(false);

    const updateAuth = useCallback((val) => {
        setAuthState(Boolean(val));
    }, []);

    useEffect(() => {
        listeners.add(updateAuth);
        setIsLoading(true);
        const token = TokenClass.getToken();
        setAuthState(Boolean(token));
        setIsLoading(false);

        return () => {
            listeners.delete(updateAuth);
        };
    }, [updateAuth]);

    const logout = useCallback(() => {
        TokenClass.clearToken();
        setAuthState(false);
        setAuthentication(false);
    }, []);

    const result = [isAuthenticated, setAuthState, isLoading];
    result.isAuthenticated = isAuthenticated;
    result.setAuthentication = setAuthState;
    result.isLoading = isLoading;
    result.logout = logout;
    return result;
}