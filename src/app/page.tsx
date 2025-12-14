'use client';

import Image from "next/image";
import styles from "./page.module.css";
import logo from '@/assets/tracevaultlogo.png';
import Link from 'next/link';
import { ArrowRight, Shield, FileCheck, Lock } from 'lucide-react';
import { useState, useCallback } from 'react';
import StarWarsIntro from '@/components/StarWarsIntro';
import { useSecretCode } from '@/hooks/useKonamiCode';
import { toast } from 'sonner';

export default function Home() {
  const [showStarWars, setShowStarWars] = useState(false); // ❌ Désactivé par défaut - activé uniquement avec "moustache"

  const handleSecretCode = useCallback(() => {
    setShowStarWars(true);
    toast.success('Easter Egg activé !', {
      description: 'Que la Force soit avec vous...',
      duration: 3000,
    });
  }, []);

  // Détecter la séquence "moustache" pour réafficher
  useSecretCode('moustache', handleSecretCode);

  const handleCloseStarWars = () => {
    setShowStarWars(false);
  };

  return (
    <>
      {showStarWars && <StarWarsIntro onClose={handleCloseStarWars} />}

      <div className={`home-container ${styles.page}`}>
      <div className="home-content">
        <div className="home-hero">
          <div className="home-logo-wrapper">
            <Image
              src={logo}
              width={300}
              height={300}
              alt="TraceVault Logo"
              priority
            />
          </div>

          <h1 className="home-title">TraceVault</h1>
          <p className="home-subtitle">
            Sécurisez vos documents avec la blockchain
          </p>

          <Link className="home-cta" href="/choix">
            <span>Lancer l'application</span>
            <ArrowRight size={20} />
          </Link>
        </div>

        <div className="home-features">
          <div className="feature-card">
            <div className="feature-icon">
              <Shield size={32} />
            </div>
            <h3>Sécurité blockchain</h3>
            <p>Vos documents sont protégés par la technologie blockchain</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FileCheck size={32} />
            </div>
            <h3>Vérification rapide</h3>
            <p>Vérifiez l'authenticité en quelques secondes</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Lock size={32} />
            </div>
            <h3>Immuable</h3>
            <p>Les enregistrements ne peuvent pas être modifiés</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
