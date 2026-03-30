import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import type { Contest, Scoreboard } from "../utils/types"

interface LayoutProps {
    scoreboard: Scoreboard | null;
    currentcontest: Contest | null;
}

const Layout = ({ scoreboard, currentcontest }: LayoutProps) => {
    return (
        <>
            <Navbar scoreboard={scoreboard} currentcontest={currentcontest} />
            <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
                <Outlet />
            </main>
        </>
    )
}

export default Layout;