import type { ReactNode } from "react";
import styles from "./SectionShell.module.css";

export interface SectionShellProps {
  title: string;
  children: ReactNode;
}

function SectionShell({ title, children }: SectionShellProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>
      {children}
    </section>
  );
}

export default SectionShell;
