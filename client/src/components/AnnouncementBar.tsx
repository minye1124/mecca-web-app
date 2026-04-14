import { useEffect, useState } from "react";
import styles from "./AnnouncementBar.module.css";

const messages = [
  { text: "Join our Beauty Loop community!", link: { label: "Sign up", url: "/register" } },
  { text: "Take our fragrance quiz!", link: { label: "Start here", url: "/quiz" } },
  { text: "Just landed: new beauty!", link: { label: "Shop now", url: "/shop" } },
];

function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const current = messages[currentIndex];

  return (
    <div className={styles.bar}>
      <div className={styles.messageContainer}>
        <span className={styles.message} key={currentIndex}>
          {current.text}
          {current.link && <a href={current.link.url}>{current.link.label}</a>}
        </span>
      </div>
      <button
        type="button"
        className={styles.pauseButton}
        onClick={() => setIsPaused((prev) => !prev)}
        aria-label={isPaused ? "Play" : "Pause"}
        aria-pressed={isPaused}
      >
        {isPaused ? "▶" : "⏸"}
      </button>
    </div>
  );
}

export default AnnouncementBar;
