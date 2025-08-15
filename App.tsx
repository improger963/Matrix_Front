import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

// Import types for navigation config
import type { View } from './types.ts';

// Global Components
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';

// Public Pages
import LandingPageView from './components/LandingPageView.tsx';
import AboutPage from './components/AboutPage.tsx';
import HowItWorks from './components/HowItWorks.tsx'; // Reusing existing component
import FAQ from './components/FAQ.tsx'; // Reusing existing component
import LoginPage from './components/LoginPage.tsx';
import RegisterPage from './components/RegisterPage.tsx';

// A layout for all public pages that share a header and footer
const PublicLayout: React.FC = () => (
    <>
        <Header />
        <main>
            <Outlet />
        </main>
        <Footer />
    </>
);

const App: React.FC = () => {
    return (
        <Routes>
            {/* Routes with shared Header/Footer */}
            <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPageView />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/faq" element={<FAQ />} />
            </Route>

            {/* Standalone routes for login/register for a more focused UI */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
        </Routes>
    );
};

export default App;