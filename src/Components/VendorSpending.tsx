"use client";
import React, { useMemo, useState } from "react";
import { useDataContext, Transaction } from "@/../backend/context/DataContext";
import { parseDateFromCSV } from "@/../backend/utils/date";

interface VendorSpendingProps {
    fullView?: boolean;
}

export const VendorSpending: React.FC<VendorSpendingProps> = ({ fullView = true }) => {
    const { fullTransactions, transactions,selectedDays } = useDataContext();

    // Choose dataset based on the fullView prop.
    const dataToUse = fullView ? fullTransactions : transactions;

    // Filter transactions to include only vendor transactions (exclude subscriptions, income, transfers)
    const vendorTransactions = useMemo(() => {
        return dataToUse.filter((tx: Transaction) => {
            const cat = (tx.category || "").trim().toLowerCase();
            return cat !== "subscriptions" && cat !== "income" && cat !== "transfers";
        });
    }, [dataToUse]);

    // Group transactions by vendor (tx.name) and capture total, count, and the category.
    const vendorSpending = useMemo(() => {
        const groups: Record<
            string,
            { name: string; total: number; count: number; transactions: Transaction[]; category: string }
        > = {};
        vendorTransactions.forEach((tx: Transaction) => {
            const vendor = (tx.name || "").trim();
            if (!groups[vendor]) {
                groups[vendor] = {
                    name: vendor,
                    total: 0,
                    count: 0,
                    transactions: [],
                    category: tx.category || "",
                };
            }
            groups[vendor].total += tx.amount;
            groups[vendor].count += 1;
            groups[vendor].transactions.push(tx);
        });
        // Sort descending by absolute total spending.
        return Object.values(groups).sort((a, b) => Math.abs(b.total) - Math.abs(a.total));
    }, [vendorTransactions]);

    // Modal state for selected vendor.
    const [selectedVendor, setSelectedVendor] = useState<string | null>(null);

    // Filter transactions for the selected vendor.
    const selectedVendorTransactions = useMemo(() => {
        if (!selectedVendor) return [];
        return vendorTransactions.filter((tx) => (tx.name || "").trim() === selectedVendor);
    }, [selectedVendor, vendorTransactions]);

    return (
        <div className="p-4 shadow-lg rounded-md col-span-3 xl:col-span-6 max-h-[70vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Vendor Spending <span className={'text-gray-800 text-sm'}>( {fullView?'Showing all transactions':`Showing Transactions for ${selectedDays} days`} )</span> </h2>
            {vendorSpending.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vendorSpending.map((vendor, idx) => (
                        <div
                            key={idx}
                            className="border p-4 rounded hover:shadow-xl transition cursor-pointer"
                            onClick={() => setSelectedVendor(vendor.name)}
                        >
                            <h3 className="text-xl font-semibold mb-2">
                                {vendor.name}{" "}
                                <span className="text-sm text-gray-500">({vendor.category})</span>
                            </h3>
                            <p className="text-gray-700">
                                Total Spent:{" "}
                                <span className="text-red-500">£{Math.abs(vendor.total).toFixed(2)}</span>
                            </p>
                            <p className="text-gray-600">Transactions: {vendor.count}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600">No vendor spending data available for the selected period.</p>
            )}

            {/* Modal for vendor details */}
            {selectedVendor && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                        <button
                            onClick={() => setSelectedVendor(null)}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl"
                            aria-label="Close modal"
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-bold mb-4">{selectedVendor} Details</h2>
                        {selectedVendorTransactions.length > 0 ? (
                            <ul className="max-h-60 overflow-y-auto">
                                {selectedVendorTransactions.map((tx, idx) => (
                                    <li key={idx} className="border-b py-2">
                                        <div className="flex justify-between">
                      <span className="font-medium">
                        {parseDateFromCSV(tx.date).toLocaleDateString("en-GB")}
                      </span>
                                            <span className="text-red-500">£{Math.abs(tx.amount).toFixed(2)}</span>
                                        </div>
                                        {tx.notes && (
                                            <div className="text-xs text-gray-600">{tx.notes}</div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No transactions available for this vendor.</p>
                        )}
                        <div className="mt-4 text-right">
                            <button
                                onClick={() => setSelectedVendor(null)}
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

export default VendorSpending;
