import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { useClarity } from './hooks/useClarity';

const App = () => {
    useClarity();
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<LandingPage />}
                />
                <Route
                    path="/*"
                    element={<p>404</p>}
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
