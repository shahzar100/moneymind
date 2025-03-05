import React from "react";
import {TotalSpent} from "@/Components/Charts/TotalSpent";
import {ChartComponent} from "@/Components/Charts/Chart";
import {Subscriptions} from "@/Components/Subscriptions";
import VendorSpending from "@/Components/VendorSpending";

export default async function Page() {
    return (
        <>
            <h1 className="text-2xl font-bold mb-8 text-center col-span-6">Money Tracker Dashboard</h1>
            <TotalSpent/>
            <ChartComponent/>
            <Subscriptions/>
            <VendorSpending/>
        </>
    );
}
