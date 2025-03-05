"use client";
import React, {useMemo} from "react";
import {Transaction, useDataContext} from "../../../backend/context/DataContext";
import {parseDateFromCSV} from "../../../backend/utils/date";
import {FaX} from "react-icons/fa6";

export const TransactionList: React.FC = () => {
    const {transactions, selectedCategory, setSelectedCategory,selectedDays} = useDataContext();

    const filteredTransactions = useMemo(() => {
        // Filter out transactions missing a date and ignore income/transfers.
        let txs = transactions.filter((tx: Transaction) => {
            const cat = (tx.category || "").trim().toLowerCase();
            // Only include transactions that have a date defined and are not income or transfers.
            return tx.date && cat !== "income" && cat !== "transfers";
        });
        if (selectedCategory) {
            txs = txs.filter((tx: Transaction) => (tx.category || "").trim().toLowerCase() === selectedCategory);
        }
        // Sort transactions by date (newest first). If date is missing, treat it as 0.
        return txs.sort((a: Transaction, b: Transaction) => {
            const aTime = a.date !== '' ? parseDateFromCSV(a.date).getTime() : 0;
            const bTime = b.date !== '' ? parseDateFromCSV(b.date).getTime() : 0;
            return bTime - aTime;
        });
    }, [transactions, selectedCategory]);

    const totalForCategory = useMemo(() => {
        if (!selectedCategory) return 0;
        return transactions
            .filter((tx) => (tx.category || "").trim().toLowerCase() === selectedCategory)
            .reduce((sum, tx) => sum + tx.amount, 0);
    }, [transactions, selectedCategory]);


    return (
        <div className="overflow-y-auto h-full max-h-[150vh] border-l p-4 col-span-2 bg-gray-100">
            <div className="flex items-center mb-4 gap-2">
                <h2 className="text-xl font-semibold flex gap-2">
                    {selectedCategory
                        ? `Transactions for "${selectedCategory}" -`
                        : `Transactions - ( Last ${selectedDays} days )`}
                    {selectedCategory && <span className={'text-red-500'}>£{totalForCategory.toFixed(2)}</span>}
                </h2>
                {selectedCategory && (
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className="text-sm text-blue-500 underline hover:text-blue-600"
                    >
                        <FaX/>
                    </button>
                )}
            </div>
            {filteredTransactions.length > 0 ? (
                <ul className="space-y-4">
                    {filteredTransactions.map((tx: Transaction, idx: number) => (
                        <li key={idx} className="text-sm border-b pb-2">
                            <div className={'flex flex-col gap-10'}>
                                <button className={'flex justify-between pr-4 text-xl group'}>
                                    {tx.name}
                                    <span className="font-medium text-red-500">{tx.amount.toFixed(2)}</span>
                                </button>

                                <div className={'flex gap-2'}>
                                    <span className="italic">{tx.category}</span>
                                    <span className="font-medium">
                                        {parseDateFromCSV(tx.date).toLocaleDateString("en-GB")}
                                </span>
                                </div>

                            </div>

                            {tx.notes && (
                                <div className="text-xs text-gray-600">{tx.notes}</div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm">
                    {selectedCategory
                        ? "No transactions found for this category."
                        : "No transactions found for the selected period."}
                </p>
            )}
        </div>
    );
};
