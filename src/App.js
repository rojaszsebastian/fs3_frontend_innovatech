import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <DashboardPage />
            </div>
        </BrowserRouter>
    );
}

export default App;