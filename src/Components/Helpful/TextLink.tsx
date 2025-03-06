import Link from "next/link";

type TextLinkProps = {
    href: string;
    text: string;
};

export const TextLink = ({href, text}: TextLinkProps) => {
    return (
        <Link href={href} className="text-sm decoration-4 decoration-blue-500 hover:underline underline-offset-4"
        >
            {text}
        </Link>
    );
};

export default TextLink;
