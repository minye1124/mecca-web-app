import styles from "./FormField.module.css";

export interface FormFieldProps {
    label: string;
    value: string;
    onChange?: (value: string) => void;
    type?: "text" | "email" | "password" | "tel";
    placeholder?: string;
    disabled?: boolean;
    //readOnly?: boolean;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

function FormField({
    label,
    value,
    onChange,
    type = "text",
    placeholder,
    disabled,
    //readOnly,
    onKeyDown,
}: FormFieldProps) {
    return (
        <div className={styles.inputGroup}>
            <label>{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                //readOnly={readOnly}
                onKeyDown={onKeyDown}
            />
        </div> 
    );
}

export default FormField;