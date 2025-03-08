import React from "react";

interface AmountProps {
    amount: number;
}

export const Amount = ({amount}: AmountProps) => {
    const formattedAmount = new Intl.NumberFormat("en-UK", {
        style: "currency",
        currency: "GBP",
    }).format(Math.abs(amount));

    return (
        <span
            className={`text-lg font-medium ${
                amount > 0 ? "text-green-500" : "text-red-500"
            }`}
        >
      {amount > 0 && "+"}
            {formattedAmount}
    </span>
    );
};
