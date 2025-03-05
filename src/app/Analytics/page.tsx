import React from "react";
import {TotalSpent} from "@/Components/Charts/TotalSpent";
import {ChartComponent} from "@/Components/Charts/Chart";
import {Subscriptions} from "@/Components/Subscriptions";
import VendorSpending from "@/Components/VendorSpending";

export default async function Page() {
    return (
        <>
            <TotalSpent/>
            <ChartComponent/>
            <Subscriptions/>
            <VendorSpending/>
        </>
    );
}
