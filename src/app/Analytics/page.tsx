import React from "react";
import Link from "next/link";
import {UserMenu} from "@/Components/UserMenu";
import {TotalSpent} from "@/Components/Charts/TotalSpent";
import {ChartComponent} from "@/Components/Charts/Chart";
import {Subscriptions} from "@/Components/Subscriptions";

export default async function Page() {
    return (
        <div className="h-screen">
            <h1 className="text-2xl font-bold mb-8 text-center col-span-2">Money Tracker Dashboard</h1>


            <div className={' grid grid-cols-6 bg-gray-200 p-4 gap-4 rounded-xl'}>
                <div className={'flex col-span-6 items-center'}>
                    <Link className="px-4 " href="/Analytics/Spending">
                        Full Analytics
                    </Link>
                    <Link className="px-4 " href="/Analytics/Spending">
                        Groups
                    </Link>
                    <Link className="px-4 " href="/Analytics/Spending">
                        Subscriptions
                    </Link>
                    <UserMenu/>
                </div>
                <TotalSpent/>
                <ChartComponent/>
                <Subscriptions/>
            </div>

        </div>
    );
}
