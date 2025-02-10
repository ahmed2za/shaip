import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <header>
        {/* Add your header content here */}
      </header>
      <main>{children}</main>
      <footer>
        {/* Add your footer content here */}
      </footer>
    </div>
  );
};

export default Layout;
