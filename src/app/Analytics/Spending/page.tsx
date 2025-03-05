import React from "react";
import {ChartComponent} from "@/Components/Charts/Chart";
import {TransactionList} from "@/Components/Charts/TransactionList";
import {DaysSelector} from "@/Components/Charts/DaysSelector";
import {TotalSpent} from "@/Components/Charts/TotalSpent";
import {SpendingInsights} from "@/Components/SpendingInsights";

export default async function Page() {
    return (
        <div className="h-screen font-[family-name:var(--font-geist-sans)] ">
            <h1 className="text-2xl font-bold mb-8 text-center">Money Tracker Dashboard</h1>
            <DaysSelector/>
            <TotalSpent/>
            <div className="flex flex-col xl:flex-row h-full">
                <ChartComponent/>
                <TransactionList/>
            </div>
            <SpendingInsights/>
        </div>
    );
}
