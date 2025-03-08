"use client";

import {DataProvider} from "@/../backend/context/DataContext";
import {HeroUIProvider} from "@heroui/react";

export function Providers({children}: { children: React.ReactNode }) {
    return (
        <DataProvider>
            <HeroUIProvider>
                {children}
            </HeroUIProvider>
        </DataProvider>
    );
}
