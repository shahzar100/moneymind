"use client";
import React, {useMemo, useState} from "react";
import {Transaction, useDataContext} from "@/../backend/context/DataContext";
import {parseDateFromCSV} from "@/../backend/utils/date";
import Link from "next/link";
import {Button} from "@heroui/react";
import {FaArrowLeft, FaArrowRight} from "react-icons/fa";
import {Amount} from "@/Components/Helpful/Amount";

interface VendorSpendingProps {
    fullView?: boolean;
}

export const VendorSpending: React.FC<VendorSpendingProps> = ({fullView = true}) => {
    const {fullTransactions, transactions, selectedDays} = useDataContext();

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
            { name: string; total: number; count: number; transactions: Transaction[]; category: string, date: string }
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
                    date: tx.date
                };
            }
            groups[vendor].total += tx.amount < 0 ? tx.amount : 0;
            groups[vendor].count += 1;
            groups[vendor].transactions.push(tx);
        });
        // Sort descending by absolute total spending.
        return Object.values(groups).sort((a, b) => Math.abs(b.total) - Math.abs(a.total));
    }, [vendorTransactions]);

    // Modal state for selected vendor.
    const [selectedVendor, setSelectedVendor] = useState<string | null>(null);

    function parseDate(dateStr: string) {
        // Split the string by "/" and create a new Date object.
        const [day, month, year] = dateStr.split('/');
        return new Date(+year, +month - 1, +day);
    }

    const selectedVendorTransactions = useMemo(() => {
        if (!selectedVendor) return [];
        return [...vendorTransactions]
            .filter((tx) => (tx.name || "").trim() === selectedVendor)
            .sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());
    }, [selectedVendor, vendorTransactions]);

    const [current, setCurrent] = useState(0);
    const [viewing, setViewing] = useState("condensed");
    const handleNext = () => {
        setCurrent((prev) => (prev + 3));
    }

    const handlePrevious = () => {
        setCurrent((prev) => (prev - 3));
    }

    return (
        <div
            className="p-4 border border-[#E0E0E0] hover:shadow-lg rounded-lg bg-white col-span-3 max-h-[60vh] overflow-y-auto flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-4 flex flex-wrap items-center gap-2">
                Vendor Spending
                <Link href={'#days-select'} className={'text-gray-800 text-sm hover:cursor-pointer'}>
                    ({fullView ? 'Showing all transactions' : `Showing Transactions for ${selectedDays} days`} )
                </Link>
            </h2>


            <div className={'flex'}>
                <Button
                    onPress={() => setViewing(viewing === "full" ? 'condensed' : 'full')}> {viewing === 'full' ? 'Condensed' : 'Full'} </Button>
            </div>
            {vendorSpending.length > 0 ? (
                <div className={'flex flex-col gap-4'}>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
                        {vendorSpending.slice(current, viewing === 'condensed' ? current + 3 : current + vendorSpending.length).map((vendor, idx) => (
                            <div
                                key={idx}
                                className="border p-4 rounded hover:shadow-xl transition cursor-pointer col-span-1"
                                onClick={() => setSelectedVendor(vendor.name)}
                            >
                                <h3 className="text-xl font-semibold mb-2">
                                    {vendor.name}{" "}
                                    <span className="text-sm text-gray-500">({vendor.category})</span>
                                </h3>
                                <p className="text-gray-700 flex items-center gap-2 flex-wrap">
                                    Total: <Amount amount={vendor.total}/>
                                </p>
                                <p className="text-gray-600">Transactions: {vendor.count}</p>
                            </div>
                        ))}
                    </div>
                    {viewing === 'condensed' && <div className={'flex justify-center items-center gap-2'}>
                        <Button
                            isDisabled={current === 0}
                            onPress={() => handlePrevious()}
                        >
                            <FaArrowLeft/>
                        </Button>
                        <Button
                            isDisabled={current + 3 >= vendorSpending.length}
                            onPress={() => handleNext()}>
                            <FaArrowRight/>
                        </Button>
                    </div>}
                </div>

            ) : (
                <p className="text-gray-600">No vendor spending data available for the selected period.</p>
            )}

            {/* Modal for vendor details */}
            {selectedVendor && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md flex flex-col gap-4 ">
                        <div className={'flex justify-between items-start'}>
                            <h2 className="text-xl font-bold flex-wrap flex">{selectedVendor}</h2>
                            <Button
                                onPress={() => setSelectedVendor(null)}
                                className="text-gray-600 hover:text-gray-800 text-2xl"
                                aria-label="Close modal"
                            >
                                &times;
                            </Button>
                        </div>

                        {selectedVendorTransactions.length > 0 ? (
                            <ul className="max-h-60 overflow-y-auto">
                                {selectedVendorTransactions
                                    .map((tx, idx) => (<li key={idx} className="border-b py-2">
                                            <div className="flex justify-between">
                                                <span className="font-medium">
                                                    {parseDateFromCSV(tx.date).toLocaleDateString("en-GB")}
                                                </span>
                                                <Amount amount={tx.amount}/>
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorSpending;
