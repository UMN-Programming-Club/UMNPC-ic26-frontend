import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import type { Contest } from "../utils/types"

interface LayoutProps {
    currentcontest: Contest | null;
}

const Layout = ({ currentcontest }: LayoutProps) => {
    return (
        <>
            <Navbar currentcontest={currentcontest} />
            <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
                <Outlet />
            </main>
        </>
    )
}

export default Layout;