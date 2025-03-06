"use client";
import React, {useMemo} from "react";
import {Transaction, useDataContext} from "../../../backend/context/DataContext";
import {parseDateFromCSV} from "../../../backend/utils/date";
import {FaX} from "react-icons/fa6";

export const TransactionList: React.FC = () => {
    const {transactions, selectedCategory, setSelectedCategory, selectedDays} = useDataContext();

    const filteredTransactions = useMemo(() => {
        // Filter out transactions missing a date and ignore income/transfers.
        let txs = transactions.filter((tx: Transaction) => {
            const cat = (tx.category || "").trim().toLowerCase();
            // Only include transactions that have a date defined and are not income or transfers.
            return tx.date && cat !== "income" && cat !== "transfers" && !tx.notes.includes("Returned");
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

    return (
        <div
            className="overflow-y-auto max-h-[70vh] border-l p-4 col-span-6 xl:col-span-2 hover:shadow-lg flex flex-col gap-4 rounded-lg border border-[#E0E0E0] bg-white">
            <div className="flex items-center mb-4 gap-2">
                <h2 className="text-xl font-semibold flex gap-2 items-center flex-wrap">
                    {selectedCategory
                        ? `Transactions for "${selectedCategory}" `
                        : `Transactions`}
                    <span className={'text-sm'}> (For Last {selectedDays} days  )</span>
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
