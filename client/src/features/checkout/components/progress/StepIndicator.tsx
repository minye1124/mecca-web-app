import styles from "./StepIndicator.module.css";

type Step = "bag" | "delivery" | "payment" | "confirmation";

interface StepIndicatorProps {
    currentStep: Step;
}

const steps: { value: Step, label: string }[] = [
    { value: "bag", label: "Bag" },
    { value: "delivery", label: "Delivery" },
    { value: "payment", label: "Payment" },
    { value: "confirmation", label: "Confirmation" },
]

function StepIndicator({ currentStep }: StepIndicatorProps) {
    const currentStepIndex = steps.findIndex(step => step.value === currentStep);
    const progressFraction = currentStepIndex / (steps.length - 1);

    return (
        <nav className={styles.nav} aria-label="Checkout progress">
            <ol
                className={styles.list}
                style={{ ["--progress-frac" as string]: progressFraction.toString() }}
            >
                {steps.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    const itemClassName = [
                        styles.item,
                        isCompleted ? styles.completed : "",
                        isCurrent ? styles.current : "",
                    ]
                        .filter(Boolean)
                        .join(" ");

                    return (
                        <li key={step.value} className={itemClassName}>
                            <span className={styles.marker} aria-hidden="true" />
                            <span className={styles.label} aria-current={isCurrent ? "step" : undefined}>
                                {step.label}
                            </span>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

export default StepIndicator;
export type { Step };
