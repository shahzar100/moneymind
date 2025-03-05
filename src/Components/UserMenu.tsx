'use client'
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@heroui/dropdown";
import React from "react";
import {FaFileExcel} from "react-icons/fa";

export const UserMenu = () => {
    return (

        <Dropdown>
            <DropdownTrigger>
                hi
            </DropdownTrigger>
            <DropdownMenu
                aria-label="Navigation Menu"
            >
                <DropdownItem
                    key="hi"
                    description="Copy the file link"
                    startContent={<FaFileExcel/>}
                >
                    Spreadsheet
                </DropdownItem>
                <DropdownItem
                    key="spreadsheet"
                    description="Copy the file link"
                    startContent={<FaFileExcel/>}
                >
                    Spreadsheet
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}


