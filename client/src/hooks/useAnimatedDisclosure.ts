import { useRef, useState } from "react";

export function useAnimatedDisclosure(closeDelayMs: number) {
    const [isOpen, setIsOpen] = useState(false)
    const [isClosing, setIsClosing] = useState(false)
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const cancelPendingClose = () => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
    };

    const open = () => {
        cancelPendingClose();
        setIsClosing(false);
        setIsOpen(true);
    }

    const close = () => {
        if (!isOpen) return;
        setIsClosing(true);
        closeTimeoutRef.current = setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
            closeTimeoutRef.current = null;
        }, closeDelayMs);
    }

    // Resets the state immediately
    const reset = () => {
        cancelPendingClose();
        setIsOpen(false);
        setIsClosing(false);
    }

    // Toggles the open/close state
    const toggle = () => {
        if (isClosing) {
            open(); // cancle the closing and reopen
            return;
        }
        if (isOpen) {
           close(); 
        } else {
            open();
        }
    }

    return { isOpen, isClosing, open, close, reset, toggle };

}