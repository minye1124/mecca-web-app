export type RegisterInputField = {
    key: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: "text" | "email" | "password" | "tel";
}

type CreateRegisterProfileFieldArgs = {
    firstName: string;
    lastName: string;
    dob: string;
    mobile: string;
    onFirstNameChange: (value: string) => void;
    onLastNameChange: (value: string) => void;
    onDobChange: (value: string) => void;
    onMobileChange: (value: string) => void;
};

type CreateRegisterPasswordFieldArgs = {
    password: string;
    confirmPassword: string;
    onPasswordChange: (value: string) => void;
    onConfirmPasswordChange: (value: string) => void;
};

export function createRegisterProfileFields({
    firstName, lastName, dob, mobile,
    onFirstNameChange, onLastNameChange, onDobChange, onMobileChange
}: CreateRegisterProfileFieldArgs): RegisterInputField[] {
    return [
        {
            key: "firstName",
            label: "First name",
            value: firstName,
            onChange: onFirstNameChange,
            placeholder: "First name",
        },
        {
            key: "lastName",
            label: "Last name",
            value: lastName,
            onChange: onLastNameChange,
            placeholder: "Last name",
        },
        {
            key: "dob",
            label: "Date of birth (optional)",
            value: dob,
            onChange: onDobChange,
            placeholder: "Date of birth (optional)",
        },
        {
            key: "mobile",
            label: "Mobile number (optional)",
            type: "tel" as const,
            value: mobile,
            onChange: onMobileChange,
            placeholder: "Mobile number (optional)",
        },
    ];
}

export function createRegisterPasswordFields({
    password, confirmPassword,
    onPasswordChange, onConfirmPasswordChange
}: CreateRegisterPasswordFieldArgs): RegisterInputField[] {
    return [
        {
            key: "password",
            label: "Password",
            type: "password",
            value: password,
            onChange: onPasswordChange,
            placeholder: "Password",
        },
        {
            key: "confirmPassword",
            label: "Confirm password",
            type: "password",
            value: confirmPassword,
            onChange: onConfirmPasswordChange,
            placeholder: "Confirm password",
        },
    ]
}