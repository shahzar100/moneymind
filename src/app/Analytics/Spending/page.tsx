import React from "react";
import {ChartComponent} from "@/Components/Charts/Chart";
import {TransactionList} from "@/Components/Charts/TransactionList";
import {TotalSpent} from "@/Components/Charts/TotalSpent";
import {SpendingInsights} from "@/Components/SpendingInsights";
import VendorSpending from "@/Components/VendorSpending";

export default async function Page() {
    return (
        <>
            <TotalSpent/>
            <ChartComponent/>
            <TransactionList/>
            <VendorSpending fullView={false}/>
            <SpendingInsights/>
        </>
    );
}
