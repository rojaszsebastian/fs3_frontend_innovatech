import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarComponent from './SidebarComponent';
import NavbarComponent from './NavbarComponent';

const MainLayout = () => {
    return (
        <div className="d-flex bg-light min-vh-100">
            <SidebarComponent />
            <div className="flex-grow-1 d-flex flex-column">
                <NavbarComponent />
                <main className="container-fluid p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;