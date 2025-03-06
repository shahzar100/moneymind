"use client";
import React from "react";
import {useDataContext} from "../../backend/context/DataContext";
import {parseDateFromCSV} from "../../backend/utils/date";

// Helper to check if a date is in the current or previous month.
function isCurrentSubscription(date: Date): boolean {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-based

    const txYear = date.getFullYear();
    const txMonth = date.getMonth();

    // Check if the transaction is in the current month.
    if (txYear === currentYear && txMonth === currentMonth) return true;

    // Check if the transaction is in the previous month.
    if (currentMonth === 0) {
        // January: previous month is December of last year.
        return txYear === currentYear - 1 && txMonth === 11;
    } else {
        return txYear === currentYear && txMonth === currentMonth - 1;
    }
}

export const Subscriptions: React.FC = () => {
    const {fullTransactions} = useDataContext();

    // Filter transactions that belong to subscriptions.
    const subscriptions = fullTransactions.filter(
        (tx) => (tx.category || "").trim().toLowerCase() === "subscriptions"
    );

    // Group subscriptions by tx.name and also store the latest date for each bundle.
    const subscriptionBundles = subscriptions.reduce((acc, tx) => {
        const name = tx.name.trim();
        const txDate = parseDateFromCSV(tx.date);
        if (!acc[name]) {
            acc[name] = {
                name,
                total: 0,
                count: 0,
                lastDate: txDate,
            };
        } else {
            // Update lastDate if this transaction is more recent.
            if (txDate > acc[name].lastDate) {
                acc[name].lastDate = txDate;
            }
        }
        acc[name].total += tx.amount;
        acc[name].count += 1;
        return acc;
    }, {} as Record<string, { name: string; total: number; count: number; lastDate: Date }>);

    const bundlesArray = Object.values(subscriptionBundles);
    const currentSubscriptions = bundlesArray.filter(bundle => isCurrentSubscription(bundle.lastDate));
    const pastSubscriptions = bundlesArray.filter(bundle => !isCurrentSubscription(bundle.lastDate));

    return (
        <div
            className="overflow-y-auto border border-[#E0E0E0] hover:shadow-lg rounded-lg bg-white p-4 col-span-3 xl:col-span-2 max-h-[60vh]">
            <h2 className="text-xl font-bold mb-4">Recurring Subscriptions</h2>
            <div className="flex flex-col gap-8">
                {/* Current Subscriptions Section */}
                <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">Current Subscriptions</h3>
                    {currentSubscriptions.length > 0 ? (
                        <ul className="space-y-4">
                            {currentSubscriptions.map((bundle, idx) => (
                                <li key={idx} className="border p-4 rounded">
                                    <div className="font-semibold text-lg">{bundle.name}</div>
                                    <div>
                                        Total Spent:{" "}
                                        <span className="text-red-500">£{bundle.total.toFixed(2)}</span> across{" "}
                                        {bundle.count} transactions.
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No current subscriptions found.</p>
                    )}
                </div>

                {/* Past Subscriptions Section */}
                <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">Past Subscriptions</h3>
                    {pastSubscriptions.length > 0 ? (
                        <ul className="space-y-4">
                            {pastSubscriptions.map((bundle, idx) => (
                                <li key={idx} className="border p-4 rounded">
                                    <div className="font-semibold text-lg">{bundle.name}</div>
                                    <div>
                                        Total Spent:{" "}
                                        <span className="text-red-500">£{bundle.total.toFixed(2)}</span> across{" "}
                                        {bundle.count} transactions.
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No past subscriptions found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Subscriptions;
