import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

const App = () => {
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
