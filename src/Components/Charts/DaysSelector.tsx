"use client";
import React, {useState} from "react";
import {useDataContext} from "../../../backend/context/DataContext";
import {Button} from "@heroui/react";

export const DaysSelector: React.FC = () => {
    const {selectedDays, setSelectedDays} = useDataContext();
    const [selectionMenu, setSelectionMenu] = useState(false);


    const DisplayValues = () => {
        const values = [7, 30, 60, 90, 365];
        return values.map((value) => (
            <button className={'hover:bg-gray-100 p-4'} key={value} onClick={() => {
                setSelectedDays(value);
                setSelectionMenu(false);
            }}>
                {value} days
            </button>
        ))
    }

    return (
        <div
            className="flex items-center space-x-3 col-span-6 rounded-lg border border-[#E0E0E0] hover:shadow-lg bg-white p-2 ">
            <label htmlFor="days-select" className="text-lg font-semibold text-gray-700">
                Select Period:
            </label>

            <div className={'relative w-40'}>
                <Button id={"days-select"} className="bg-transparent border-blue-500 border w-full"
                        onPress={() => setSelectionMenu(!selectionMenu)}>
                    {selectedDays} days
                </Button>
                <div
                    className={` ${selectionMenu ? 'absolute' : 'hidden'} top-10 bg-white z-30 flex flex-col w-full`}>
                    <DisplayValues/>
                </div>
            </div>
        </div>
    );
};

export default DaysSelector;
