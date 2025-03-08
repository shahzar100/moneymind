import React from "react";

export const Amount = ({amount}) => {
    return (
        <span
            className={`text-lg font-medium ${
                amount > 0 ? "text-green-500" : "text-red-500"
            }`}
        >
            {amount > 0 && "+"}
            {Math.abs(amount).toFixed(2)}
        </span>
    )
}
