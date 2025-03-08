'use client'
import Link from "next/link";
import {useAuth0} from "@auth0/auth0-react";
import {Button} from "@heroui/react";
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@heroui/dropdown";
import TextLink from "@/Components/Helpful/TextLink";

export const Header = () => {
    const {loginWithRedirect, logout, isAuthenticated, user} = useAuth0();
    const linkData = [
        {
            link: '/analytics',
            text: 'Analytics'
        },
        {
            link: '/connections',
            text: 'Connections'
        },
        {
            link: '/how-to-use',
            text: 'How to use'
        }
    ]

    const Links = () => {
        return (
            <div className={'hidden xl:flex items-center gap-2'}>
                {linkData.map((link) => (
                    <TextLink key={link.text} text={link.text} href={link.link}/>
                ))}
            </div>

        )
    }

    return (
        <header className="flex justify-between items-center pt-4 pb-4 px-4 bg-white shadow">
            <h1 className="text-xl font-bold">Money Mind</h1>
            <nav className="flex items-center gap-4">

                <Links/>
                {isAuthenticated ? (
                    <Dropdown>
                        <DropdownTrigger>
                            <Button color={'primary'} variant={'solid'}>
                                {user?.given_name}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                            <>
                                {linkData.map((link) => (
                                    <DropdownItem key={link.text} className={'block xl:hidden'}>
                                        <Link href={link.link}>
                                            {link.text}
                                        </Link>
                                    </DropdownItem>
                                ))}
                            </>


                            <DropdownItem
                                onPress={() => logout()}
                                key={'account'}
                                variant={'solid'}
                            >
                                <Link href={'/Account'}>
                                    Account
                                </Link>
                            </DropdownItem>
                            <DropdownItem
                                onPress={() => logout()}
                                key={'settings'}
                                variant={'solid'}
                            >
                                <Link href={'/Account/Settings'}>
                                    Settings
                                </Link>
                            </DropdownItem>
                            <DropdownItem
                                onPress={() => logout()}
                                className={'text-danger'}
                                key={'signOut'}
                                color={'danger'} variant={'solid'}
                            >
                                Sign out
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                ) : (
                    <Button onPress={() => loginWithRedirect()}>
                        Sign in
                    </Button>
                )}
            </nav>
        </header>
    );
};
