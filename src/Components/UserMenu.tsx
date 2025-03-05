'use client'
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@heroui/dropdown";
import React from "react";
import {FaFileExcel, FaObjectGroup} from "react-icons/fa";
import {Button} from "@heroui/react";

export const UserMenu = () => {
    return (
        <Dropdown>
            <DropdownTrigger>
                <Button color={'primary'}>
                    Add
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                aria-label="Navigation Menu"
            >
                <DropdownItem
                    key="hi"
                    description="Oranise payments into groups"
                    startContent={<FaObjectGroup/>}
                >
                    Group
                </DropdownItem>
                <DropdownItem
                    key="spreadsheet"
                    description="Add a new monthly spreadsheet of information"
                    startContent={<FaFileExcel/>}
                >
                    Spreadsheet
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}


