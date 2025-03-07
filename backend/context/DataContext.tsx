"use client";
import React, {createContext, useContext, useEffect, useState} from "react";
import Papa from "papaparse";
import {parseDateFromCSV} from "@/../backend/utils/date";

export interface Transaction {
    date: string;
    type: string;
    name: string;
    amount: number;
    notes: string;
    category: string;
}

interface DataContextType {
    fullTransactions: Transaction[];
    transactions: Transaction[];
    selectedDays: number;
    setSelectedDays: (days: number) => void;
    selectedCategory: string | null;
    setSelectedCategory: (category: string | null) => void;
    loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    // State to store the CSV data.
    const [fullTransactions, setFullTransactions] = useState<Transaction[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [selectedDays, setSelectedDays] = useState<string>("7");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Load the CSV file from the public folder on mount.
    useEffect(() => {
        const loadCSV = async () => {
            try {
                const res = await fetch("/data.csv");
                if (!res.ok) {
                    new Error("Failed to fetch CSV file.");
                }
                const csvText = await res.text();
                const parsed = Papa.parse(csvText, {header: true, skipEmptyLines: true});
                // Map parsed data to Transaction objects using the CSV headers.
                const data: Transaction[] = (parsed.data as unknown as Array<Record<string, string>>).map(row => ({
                    date: row.Date,  // CSV header "Date"
                    type: row.Type,  // CSV header "Type"
                    name: row.Name,  // CSV header "Name"
                    amount: parseFloat(row["Local amount"]),  // CSV header "Local amount"
                    notes: row["Notes and #tags"] || "",
                    category: row.Category,  // CSV header "Category"
                }));
                setFullTransactions(data);
                const cutoff = new Date();
                cutoff.setDate(cutoff.getDate() - selectedDays);
                const filtered = fullTransactions.filter(tx => parseDateFromCSV(tx.date) >= cutoff);
                setTransactions(filtered);
            } catch (error) {
                console.error("Error loading CSV:", error);
            } finally {
                setLoading(false);
            }
        };
        void loadCSV();
    }, []);

    // Update filtered transactions whenever selectedDays changes.
    useEffect(() => {
        if (fullTransactions.length === 0) return;
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - selectedDays);
        const filtered = fullTransactions.filter(tx => parseDateFromCSV(tx.date) >= cutoff);
        setTransactions(filtered);
    }, [selectedDays, fullTransactions]);

    return (
        <DataContext.Provider
            value={{
                fullTransactions,
                transactions,
                selectedDays,
                setSelectedDays,
                selectedCategory,
                setSelectedCategory,
                loading,
            }}
        >
            {loading ? <div>Loading transactions...</div> : children}
        </DataContext.Provider>
    );
};

export function useDataContext() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useDataContext must be used within a DataProvider");
    }
    return context;
}
