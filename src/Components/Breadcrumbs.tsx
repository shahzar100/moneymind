"use client";

import React from "react";
import {usePathname} from "next/navigation";
import TextLink from "@/Components/Helpful/TextLink";

export const Breadcrumbs: React.FC = () => {
    const pathname = usePathname(); // e.g. "/Analytics/Spending/Groups"

    // Split the pathname into segments and filter out empty strings.
    const segments = pathname.split("/").filter(segment => segment);

    // Create breadcrumb items.
    const breadcrumbs = segments.map((segment, index) => {
        // Construct the href by joining the segments up to the current index.
        const href = "/" + segments.slice(0, index + 1).join("/");
        // Capitalize the first letter of the segment.
        const label = segment.charAt(0).toUpperCase() + segment.slice(1);
        return {href, label};
    });

    return (
        <div className="p-4 col-span-4">
            <ol className="flex items-center space-x-2">
                {/* Always include Home as the first breadcrumb */}
                <li>
                    <TextLink text={"Home"} href="/"/>
                    {breadcrumbs.length > 0 && <span className="mx-2">/</span>}
                </li>
                {breadcrumbs.map((crumb, index) => (
                    <li key={index} className="flex items-center">
                        <TextLink href={crumb.href} text={crumb.label}/>
                        {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default Breadcrumbs;
