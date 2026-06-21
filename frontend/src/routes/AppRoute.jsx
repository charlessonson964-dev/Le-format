import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import Home from '../features/Home';
import FormatsPage from '../features/FormatsPage';
import HowItWorks from '../features/HowItWorks';

export default function AppRoute() {
    return (
        <Router>
            <MainLayout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/formats" element={<FormatsPage />} />
                    <Route path="/how" element={<HowItWorks />} />
                    <Route path="*" element={<h1 className="text-center py-20">Paj la pa egziste (404)</h1>} />
                </Routes>
            </MainLayout>
        </Router>
    );
}
