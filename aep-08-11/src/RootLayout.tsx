import Header from "./components/header/header";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
    return (
        <>
            <Header />
            <main className="p-6">
                <Outlet />
            </main>
        </>
    );
}