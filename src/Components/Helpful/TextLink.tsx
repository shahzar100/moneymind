'use client'
import Link from "next/link";
import {usePathname} from "next/navigation";

type TextLinkProps = {
    href: string;
    text: string;
};

export const TextLink = ({href, text}: TextLinkProps) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`text-sm decoration-4 decoration-blue-500 hover:underline underline-offset-4 transition-colors duration-200 ${
                isActive ? "underline font-bold" : ""
            }`}
        >
            {text}
        </Link>
    );
};

export default TextLink;
