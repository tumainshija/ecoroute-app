'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();
  
  // Define paths where the navbar should not be shown
  const excludedPaths = ['/login', '/signup', '/register', '/profile'];
  
  // Check if current path starts with any excluded path
  const shouldExcludeNavbar = excludedPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  if (shouldExcludeNavbar) {
    return null;
  }
  
  return <Navbar />;
} 