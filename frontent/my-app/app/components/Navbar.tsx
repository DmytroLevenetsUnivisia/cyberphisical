import Link from "next/link";

export default function Navbar() {
    return (
        <nav className={"flex items-center max-w-4xl m-auto justify-between p-4 text-white"}>
            <Link href="/">Sensors</Link>
            <Link href="/login">Login / Sign Up</Link>
        </nav>
    );
}