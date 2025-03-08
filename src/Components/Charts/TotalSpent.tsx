"use client";
import React, {useMemo, useState} from "react";
import {useDataContext} from "../../../backend/context/DataContext";

export const TotalSpent: React.FC = () => {
    const {transactions, selectedDays, selectedCategory} = useDataContext();
    // Filter transactions: ignore income and transfers; further filter by category if selected.
    const filteredTransactions = useMemo(() => {
        let txs = transactions.filter((tx) => {
            const cat = (tx.category || "").trim().toLowerCase();
            return cat !== "income" && cat !== "transfers";
        });
        if (selectedCategory) {
            txs = txs.filter((tx) => tx.category.trim().toLowerCase() === selectedCategory);
        }
        return txs;
    }, [transactions, selectedCategory]);

    const incomeTransactions = useMemo(() => {
        return transactions.filter((tx) => {
            const cat = (tx.category || "").trim().toLowerCase();
            return cat === "income";
        });
    }, [transactions]);

    // Compute aggregated breakdown per category.
    const breakdown = useMemo(() => {
        const breakdownMap: Record<string, number> = {};
        filteredTransactions.forEach((tx) => {
            const cat = (tx.category || "").trim().toLowerCase();
            breakdownMap[cat] = (breakdownMap[cat] || 0) + tx.amount;
        });
        return Object.entries(breakdownMap).sort(([, a], [, b]) => b - a);
    }, [filteredTransactions]);

    const totalSpent = useMemo(() => {
        return filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    }, [filteredTransactions]);

    const totalIncome = useMemo(() => {
        return incomeTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    }, [incomeTransactions]);

    // Modal state for breakdown
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div
            className="p-4 rounded-lg border border-[#E0E0E0] hover:shadow-lg bg-white col-span-6 flex items-end flex-wrap justify-evenly">
            <h3 className="text-lg font-semibold">
                Spending <span className="text-red-500">£{Math.abs(totalSpent).toLocaleString()}</span> pounds
            </h3>
            <h3 className="text-lg font-semibold">
                Income <span className="text-green-500">£{totalIncome.toLocaleString()}</span> pounds
            </h3>
            <button
                onClick={openModal}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                Categories
            </button>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className=" rounded-lg p-6 w-full max-w-md relative bg-white">
                        <h2 className="text-xl font-bold mb-4">Category Breakdown ({selectedDays} days) </h2>
                        <ul className="max-h-60 overflow-y-auto">
                            <h3 className="text-lg font-semibold">
                                Total Income: <span
                                className="text-green-500">£{totalIncome.toLocaleString()}</span> pounds
                            </h3>

                            {breakdown.map(([category, amt], idx) => (
                                <li key={idx} className="flex justify-between border-b py-2">
                                    <span className="font-medium">{category}</span>
                                    <span className="text-red-500">£{Math.abs(amt).toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 text-right">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
