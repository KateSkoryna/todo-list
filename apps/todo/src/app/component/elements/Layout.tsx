import { ReactNode } from 'react';
import Header from './Header';
import UserMenu from './UserMenu';
import heroBg from '../../../assets/hero.webp';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-base-bg">
      <div className="relative w-full h-[300px]">
        <img
          src={heroBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative max-w-6xl mx-auto px-4 h-full flex justify-between items-end pb-6">
          <Header />
          <UserMenu />
        </div>
      </div>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

export default Layout;
