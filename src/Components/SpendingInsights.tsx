"use client";
import React, {useEffect, useState} from "react";
import {Transaction, useDataContext} from "../../backend/context/DataContext";

interface SpendingInsightsResponse {
    insights: string;
}

export const SpendingInsights: React.FC = () => {
    const {transactions, selectedCategory} = useDataContext();
    const [analysis, setAnalysis] = useState<SpendingInsightsResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchInsights = async () => {
            // Create a filtered list of transactions that excludes income and transfers.
            const filtered: Transaction[] = transactions.filter((tx) => {
                const cat = tx.category.trim().toLowerCase();
                if (cat === "income" || cat === "transfers") return false;
                if (selectedCategory) {
                    return cat === selectedCategory;
                }
                return true;
            });

            setLoading(true);
            try {
                console.log(filtered.length)
                const res = await fetch("http://127.0.0.1:8000/analyze", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(filtered),
                });

                if (!res.ok) {
                    new Error(`HTTP error! status: ${res.status}`);
                }

                const data: SpendingInsightsResponse = await res.json();
                setAnalysis(data);
            } catch (err) {
                console.error("Error fetching analysis:", err);
            } finally {
                setLoading(false);
            }
        };

        void fetchInsights();
    }, [transactions, selectedCategory]);

    return (
        <div className="mt-4 p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-2">Spending Insights</h2>
            {loading ? (
                <p>Loading insights...</p>
            ) : analysis ? (
                <div>
                    <p>{analysis.insights}</p>
                </div>
            ) : (
                <p>No insights available.</p>
            )}
        </div>
    );
};
