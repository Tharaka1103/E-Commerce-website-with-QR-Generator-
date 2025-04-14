"use client"

import { useState, useEffect, useCallback  } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeSwitch } from './ThemeSwitch'
import { motion, useScroll } from 'framer-motion'
import { FiHome, FiInfo, FiMenu, FiBookOpen, FiPhone, FiUser } from 'react-icons/fi'
import { usePathname } from 'next/navigation'

interface User {
  name: string;
  email: string;
}

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setIsScrolled(latest > 20)
    })
    return () => unsubscribe()
  }, [scrollY])

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/user-login/check', {
        credentials: 'include',
        cache: 'no-store'
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    }
  }, [])

  useEffect(() => {
    checkAuthStatus()
    window.addEventListener('user-logged-in', checkAuthStatus)
    return () => {
      window.removeEventListener('user-logged-in', checkAuthStatus)
    }
  }, [checkAuthStatus])

  return (
    <>
      <motion.header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-background backdrop-blur-md shadow-sm h-12'
            : 'bg-transparent h-16'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <Link href="/" className="flex items-center space-x-2 group">
              <motion.span 
                className="text-2xl font-bold"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image 
                  src="/logo.jpg" 
                  alt="Restaurant Logo" 
                  width={80} 
                  height={80}
                  className="rounded-full"
                  priority 
                />
              </motion.span>
            </Link>

            <nav className="hidden md:flex rounded-lg p-1 items-center space-x-4">
              {[
                { href: '/', icon: FiHome, label: 'Home' },
                { href: '/menu', icon: FiMenu, label: 'Menu' },
                { href: '/about', icon: FiInfo, label: 'About' },
                { href: '/reservations', icon: FiBookOpen, label: 'Reservations' },
                { href: '/contact', icon: FiPhone, label: 'Contact' },
              ].map(({ href, icon: Icon, label }, index) => (
                <div key={href} className="flex items-center">
                  <Link 
                    href={href} 
                    className={`flex items-center space-x-2 transition-all duration-300 p-2 rounded-lg hover:scale-105 ${
                      pathname === href
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-primary/5 hover:text-primary'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{label}</span>
                  </Link>
                  {index < 4 && <span className="text-foreground/30 mx-2">•</span>}
                </div>
              ))}
            </nav>

            <div className="flex items-center space-x-3">
              <Link 
                href="/login" 
                className="hidden md:flex items-center space-x-2 bg-primary text-black px-4 py-2 rounded-lg hover:bg-primary/90 transition-all duration-300"
              >
                <FiUser className="w-4 h-4" />
                <span className="text-sm font-medium">Login</span>
              </Link>
              <ThemeSwitch />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background backdrop-blur-md border-t border-border z-50">
        <div className="grid grid-cols-6 gap-2 p-4">
          {[
            { href: '/', icon: FiHome, label: 'Home' },
            { href: '/menu', icon: FiMenu, label: 'Menu' },
            { href: '/about', icon: FiInfo, label: 'About' },
            { href: '/reservations', icon: FiBookOpen, label: 'Reservations' },
            { href: '/contact', icon: FiPhone, label: 'Contact' },
            { href: '/login', icon: FiUser, label: 'Login' },
          ].map(({ href, icon: Icon, label }) => (
            <Link 
              key={href}
              href={href} 
              className="flex flex-col items-center justify-center group"
            >
              <span className="absolute bottom-full mb-2 px-2 py-1 bg-primary text-black text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {label}
              </span>
              <Icon className={`w-6 h-6 ${
                pathname === href ? 'text-primary' : 'text-foreground'
              }`} />
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
