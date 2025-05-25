'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils';

const categories = [
  { name: 'All', href: '/', icon: 'grid' },
  { name: 'Beaches', href: '/?category=beaches', icon: 'wave' },
  { name: 'Murals', href: '/?category=murals', icon: 'paint' },
  { name: 'Food', href: '/?category=food', icon: 'utensils' },
  { name: 'Restrooms', href: '/?category=restrooms', icon: 'restroom' },
  { name: 'Other', href: '/?category=other', icon: 'dots' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const currentCategory = searchParams.get('category') || '';

  return (
    <header className="relative z-50 w-full bg-white border-b border-gray-200">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-xl font-bold text-primary">Discover Bermuda</span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-500 hover:text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-center lg:gap-x-2">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className={cn(
                'nav-link text-sm font-semibold leading-6',
                (category.href === '/' && !currentCategory) || 
                (category.href.includes(currentCategory) && currentCategory) ? 'active' : ''
              )}
            >
              {category.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link
            href="/login"
            className="text-sm font-semibold leading-6 text-primary hover:text-primary-hover transition-colors"
          >
            Log in <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </nav>
      {/* Mobile menu */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden',
          mobileMenuOpen ? 'block' : 'hidden'
        )}
      >
        <div
          className="mobile-menu-backdrop fixed inset-0"
          aria-hidden="true"
          onClick={() => setMobileMenuOpen(false)}
        />
        <nav className="fixed inset-y-0 right-0 w-3/4 overflow-y-auto bg-white px-4 py-4 sm:max-w-sm sm:px-6 shadow-lg">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="-m-1.5 p-1.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="text-xl font-bold text-primary">Discover Bermuda</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-500 hover:text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-200">
              <div className="space-y-2 py-6">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className={cn(
                      'flex w-full items-center rounded-lg px-3 py-2 text-base font-semibold leading-7',
                      (category.href === '/' && !currentCategory) || 
                      (category.href.includes(currentCategory) && currentCategory)
                        ? 'bg-blue-50 text-primary'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <Link
                  href="/login"
                  className="flex w-full items-center rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-primary hover:bg-gray-50 hover:text-primary-hover transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
} 