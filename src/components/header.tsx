'use client';

import { useState } from 'react'
import '../styles/globals.scss';
import Link from 'next/link';
import { Menu, X, HelpCircle } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { usePathname } from 'next/navigation';
import HelpModal from './HelpModal';
import { getHelpContent } from '../utils/helpContent';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const pathname = usePathname();

  const handleHelpClick = () => {
    setIsHelpModalOpen(true);
    // Fermer le menu mobile si ouvert
    setIsMenuOpen(false);
  };

  const handleCloseHelp = () => {
    setIsHelpModalOpen(false);
  };

  // Récupérer le contenu d'aide en fonction de la page actuelle
  const helpContent = getHelpContent(pathname);

  return (
    <>
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

          <button className='help-button' onClick={handleHelpClick}>
            <HelpCircle size={20} />
            <span>Aide</span>
          </button>
        <ConnectButton />
        </nav>
      </header>

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={handleCloseHelp}
        content={helpContent}
      />
    </>
  )
}

export default Header