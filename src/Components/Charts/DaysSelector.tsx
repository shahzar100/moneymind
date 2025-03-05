"use client";
import React, {ChangeEvent} from "react";
import {useDataContext} from "../../../backend/context/DataContext";

export const DaysSelector: React.FC = () => {
    const {selectedDays, setSelectedDays} = useDataContext();

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const days = parseInt(e.target.value);
        console.log("Selected days:", days);
        setSelectedDays(days);
    };

    return (
        <div className="flex items-center space-x-3 col-span-6 shadow-lg rounded-md p-2">
            <label htmlFor="days-select" className="text-lg font-semibold text-gray-700">
                Select Period:
            </label>
            <select
                id="days-select"
                value={selectedDays}
                onChange={handleChange}
                className="p-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
                <option value={7}>Last 7 Days</option>
                <option value={14}>Last 14 Days</option>
                <option value={30}>Last 30 Days</option>
                <option value={60}>Last 60 Days</option>
                <option value={90}>Last 90 Days</option>

                <option value={365}>365 days</option>
            </select>
        </div>
    );
};
