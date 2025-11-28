'use client';

import React, { useState } from 'react'
import '../styles/globals.scss';
import Link from 'next/link';
import { Menu, X, HelpCircle } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header-container">
      <Link href="/" className='logo'>
        <span className='logo-text'>TraceVault</span>
      </Link>

      <button
        className='menu-toggle'
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
        <Link href="/listenft" className='nav-link'>
          Vos NFT
        </Link>
        
        <button className='help-button'>
          <HelpCircle size={20} />
          <span>Aide</span>
        </button>
      <ConnectButton />
      </nav>
    </header>
  )
}

export default Header