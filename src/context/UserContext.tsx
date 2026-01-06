
import React, { createContext, useContext, useState, useEffect } from "react";

interface UserContextType {
    isNewUser: boolean;
    completeOnboarding: () => void;
    resetOnboarding: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize from localStorage or default to true (New User)
    const [isNewUser, setIsNewUser] = useState<boolean>(() => {
        const stored = localStorage.getItem("isNewUser");
        return stored === null ? true : stored === "true";
    });

    useEffect(() => {
        localStorage.setItem("isNewUser", String(isNewUser));
    }, [isNewUser]);

    const completeOnboarding = () => {
        setIsNewUser(false);
    };

    const resetOnboarding = () => {
        setIsNewUser(true);
    };

    return (
        <UserContext.Provider value={{ isNewUser, completeOnboarding, resetOnboarding }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
