"use client";
import React, {useMemo} from "react";
import {Transaction, useDataContext} from "../../../backend/context/DataContext";
import {parseDateFromCSV} from "../../../backend/utils/date";
import {FaX} from "react-icons/fa6";
import {Amount} from "@/Components/Helpful/Amount";

export const TransactionList: React.FC = () => {
    const {transactions, selectedCategory, setSelectedCategory, selectedDays} = useDataContext();

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

    return (
        <div
            className="overflow-y-auto max-h-[60vh] border-l p-4 col-span-3 xl:col-span-2 hover:shadow-lg flex flex-col gap-4 rounded-lg border border-[#E0E0E0] bg-white">
            <div className="flex justify-between items-center mb-4 gap-2">
                <h2 className="text-xl font-semibold flex flex-col xl:flex-row gap-2 items-center flex-wrap">
                    {selectedCategory
                        ? `Transactions for "${selectedCategory}" `
                        : `Transactions`}
                    <div className={'text-sm'}>
                        <p> {filteredTransactions.length} transactions for last {selectedDays} days</p>
                        <p></p>
                    </div>

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
                        <li
                            key={idx}
                            className="bg-white shadow rounded-md border p-4 transition transform hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div className="flex flex-col space-y-3">
                                <div className="flex flex-wrap gap-4 justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-800">{tx.name}</h3>
                                    <Amount amount={tx.amount}/>
                                </div>

                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <span className="italic">{tx.category}</span>
                                    <span>•</span>
                                    <span>{parseDateFromCSV(tx.date).toLocaleDateString("en-GB")}</span>
                                </div>

                                {tx.notes && (
                                    <p className="text-gray-600 text-sm">{tx.notes}</p>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-center text-gray-500">
                    {selectedCategory
                        ? "No transactions found for this category."
                        : "No transactions found for the selected period."}
                </p>
            )}

        </div>
    );
};
