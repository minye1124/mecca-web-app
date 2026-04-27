import { useEffect, useState } from "react";

import { getCheckoutSummary } from "../api/checkout";
import type { CheckoutSummaryResponse } from "../types";

export function useCheckoutSummary() {
    const [data, setData] = useState<CheckoutSummaryResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadCheckoutSummary() {
            try {
                setIsLoading(true);
                setError(null);

                const response = await getCheckoutSummary();
                setData(response);
            } catch {
                setError("We couldn't load your order summary right now.");
            } finally {
                setIsLoading(false);
            }
        }

        void loadCheckoutSummary();
    }, []);

    return {
        data,
        isLoading,
        error,
    };
}

