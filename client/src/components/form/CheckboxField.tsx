import styles from "./CheckboxField.module.css";

export interface CheckboxFieldProps {
    id: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
    children: React.ReactNode;
}

function CheckboxField({ id, checked, onChange, disabled, onKeyDown, children }: CheckboxFieldProps) {
    return (
        <div className={styles.checkboxGroup}>
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
                onKeyDown={onKeyDown}
            />
            <label htmlFor={id}>{children}</label>
        </div>
    );
}

export default CheckboxField;