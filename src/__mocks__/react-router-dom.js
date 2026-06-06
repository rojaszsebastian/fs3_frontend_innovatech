import React from 'react';

export const BrowserRouter = ({ children }) => <div>{children}</div>;
export const Routes = ({ children }) => <div>{children}</div>;
export const Route = ({ element }) => element || null;
export const Navigate = () => null;
export const NavLink = ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>;
export const Outlet = () => <div>Outlet Content</div>;
