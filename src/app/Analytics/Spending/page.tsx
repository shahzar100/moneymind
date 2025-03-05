import React from "react";
import {ChartComponent} from "@/Components/Charts/Chart";
import {TransactionList} from "@/Components/Charts/TransactionList";
import {DaysSelector} from "@/Components/Charts/DaysSelector";
import {TotalSpent} from "@/Components/Charts/TotalSpent";
import {SpendingInsights} from "@/Components/SpendingInsights";

export default async function Page() {
    return (
        <div className={' grid grid-cols-6 bg-gray-200 p-4 gap-4 rounded-xl'}>
            <h1 className="text-2xl font-bold mb-8 text-center col-span-6">Money Tracker Dashboard</h1>
                <DaysSelector/>
                <TotalSpent/>
                <ChartComponent/>
                <TransactionList/>
            <SpendingInsights/>
        </div>
    );
}
