import FormField from "../../../components/form/FormField";
import {type FormFieldProps} from "../../../components/form/FormField";

type AuthTextFieldProps = FormFieldProps & {
    submitOnEnter?: () => void;
}

function AuthTextField({ submitOnEnter, onKeyDown, ...props }: AuthTextFieldProps) {
    return (
        <FormField
            {...props}
            onKeyDown={(e) => {
                onKeyDown?.(e);
                if (e.key === "Enter") {
                    submitOnEnter?.();
                }
            }}
        />
    );
}

export default AuthTextField;
