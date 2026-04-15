import styles from "./SlideInPanel.module.css";
import type { ReactNode } from "react";

export interface SlideInPanelProps {
    side: "left" | "right";
    width?: number;
    top?: string;
    onClose: () => void;
    children: ReactNode;
}

function SlideInPanel({ side, width = 480, top = "0px", onClose, children }: SlideInPanelProps) {
    const panelClassName = side === "left" ? styles.panelLeft : styles.panelRight;

    return (
        <>
            <div 
                className={styles.overlay} 
                style={{ top }} 
                onClick={onClose}
            />
            <div
                className={panelClassName}
                style={{ width, top, height: `calc(100% - ${top})` }}
            >
                <button
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="Close"
                >
                    ✕
                </button>
                {children}
            </div>
        </>
    );
}

export default SlideInPanel;