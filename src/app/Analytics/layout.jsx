import Link from "next/link";
import {UserMenu} from "../../Components/UserMenu";
import React from "react";
import Breadcrumbs from "../../Components/Breadcrumbs";

export const Layout = ({children}) => {
    return (
        <div className={''}>
            <h1 className="mb-4 text-2xl font-bold text-center col-span-6">Money Tracker Dashboard</h1>
            <div className={'grid grid-cols-6 p-2 xl:p-4 gap-4 rounded-md bg-[#F0F2F5]'}>
                <Breadcrumbs/>
                <div
                    className={'flex col-span-6 items-center bg-white rounded-lg hover:shadow-lg border border-[#E0E0E0] p-4'}>
                    <Link className="px-4 " href="/Analytics/Spending">
                        Groups
                    </Link>
                    <Link className="px-4 " href="/Analytics/Spending">
                        Subscriptions
                    </Link>
                    <UserMenu/>
                </div>
                {children}
            </div>
        </div>
    )
}

export default Layout