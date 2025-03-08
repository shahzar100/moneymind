import React from "react";
import Breadcrumbs from "../../Components/Breadcrumbs";
import TextLink from "../../Components/Helpful/TextLink";
import DaysSelector from "../../Components/Charts/DaysSelector";

export const Layout = ({children}) => {
    return (
        <div className={''}>
            <h1 className="mb-4 text-2xl font-bold text-center col-span-6">Money Tracker Dashboard</h1>
            <div className={'grid grid-cols-6 p-4 gap-4 rounded-md bg-[#F0F2F5]'}>
                <div className={'col-span-6 flex justify-between'}>
                    <Breadcrumbs/>
                    <DaysSelector/>
                </div>
                <div
                    className="flex gap-4 col-span-6 items-center bg-white rounded-lg hover:shadow-lg border border-[#E0E0E0] p-4">
                    <TextLink href={'/Analytics'} text={'Dashboard Home'}/>
                    <TextLink
                        href="/Analytics/Spending"
                        text="Full Analytics"
                    />
                    <TextLink
                        href="/Analytics/Subscriptions"
                        text="Subscriptions"
                    />
                </div>
                {children}
            </div>
        </div>
    )
}

export default Layout