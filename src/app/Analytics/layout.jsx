import Link from "next/link";
import {UserMenu} from "../../Components/UserMenu";
import React from "react";
import Breadcrumbs from "../../Components/Breadcrumbs";

export const Layout = ({children}) => {
    return (
        <div className={''}>
            <h1 className="text-2xl font-bold mb-8 text-center col-span-6">Money Tracker Dashboard</h1>
            <Breadcrumbs/>

            <div className={'flex col-span-6 items-center'}>
                <Link className="px-4 " href="/Analytics/Spending">
                    Groups
                </Link>
                <Link className="px-4 " href="/Analytics/Spending">
                    Subscriptions
                </Link>
                <UserMenu/>
            </div>


            <div className={'grid grid-cols-6  p-4 gap-4 rounded-xl bg-gray-50'}>
                {children}
            </div>
        </div>
    )
}

export default Layout