export const toIsoDate = (value: string): string | null => {
    if (!value) return null;
    return new Date(value.split("/").reverse().join("-")).toISOString();
}

export const formatDobInput = (value: string): string => {
    const digits = value.replace(/\D/g, ""); // Remove non-digit characters
    if (digits.length >= 4) {
        return digits.slice(0, 2) + "/" + digits.slice(2, 4) + "/" + digits.slice(4);
    }
    if (digits.length >= 2) {
        return digits.slice(0, 2) + "/" + digits.slice(2);
    }
    return digits;
}