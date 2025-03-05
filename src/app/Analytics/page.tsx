import React from "react";
import Link from "next/link";
import {UserMenu} from "@/Components/UserMenu";

export default async function Page() {
    return (
        <div className="h-screen ">
            <h1 className="text-2xl font-bold mb-8 text-center">Money Tracker Dashboard</h1>
            <Link className="px-4 bg-gray-200" href="/Analytics/Spending">
                Full Analytics
            </Link>
            <p className=" p-4 bg-yellow-100"> hi </p>
            <UserMenu/>
        </div>
    );
}
