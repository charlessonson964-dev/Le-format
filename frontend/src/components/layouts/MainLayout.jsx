import Header from "./header";
import Footer from "./footer";

export default function MainLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            <Header />

            <main className="w-full flex-grow">
                {children}
            </main>

            <Footer />
        </div>
    );
}
