'use client';

import { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';
import '../styles/starwars.scss';

interface StarWarsIntroProps {
  onClose: () => void;
}

export default function StarWarsIntro({ onClose }: StarWarsIntroProps) {
  const [stars, setStars] = useState<Array<{ top: number; left: number }>>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null); // 🔑 Référence à l'audio

  // Date spéciale : 4 mai (May the 4th be with you)
  const isMay4th = () => {
    const today = new Date();
    return today.getMonth() === 4 && today.getDate() === 4; // Mois 4 = Mai (0-indexed)
  };

  useEffect(() => {
    // Générer les étoiles
    const numStars = 150;
    const newStars = [];

    for (let i = 0; i < numStars; i++) {
      newStars.push({
        top: Math.floor(Math.random() * window.innerHeight),
        left: Math.floor(Math.random() * window.innerWidth)
      });
    }

    setStars(newStars);

    // 🎵 Lancer la musique Star Wars immédiatement
    // 🔑 Vérifier qu'il n'y a pas déjà un audio en cours (évite double lecture en React Strict Mode)
    if (!audioRef.current) {
      const audio = new Audio('https://ia801307.us.archive.org/17/items/StarWarsThemeSongByJohnWilliams/Star%20Wars%20Theme%20Song%20By%20John%20Williams.mp3');
      audio.volume = 0.5; // Volume à 50%
      audio.loop = false; // Pas de boucle
      audioRef.current = audio; // 🔑 Stocker la référence

      // Forcer le lancement immédiat (fonctionne car déclenché par interaction utilisateur "moustache")
      audio.play().catch((error) => {
        console.warn('⚠️ Impossible de lire l\'audio:', error);
        // Réessayer après un court délai
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().catch(e => console.error('Échec définitif audio:', e));
          }
        }, 100);
      });
    }

    // Fermer automatiquement après l'animation (environ 2 minutes)
    const timer = setTimeout(() => {
      onClose();
    }, 120000);

    return () => {
      clearTimeout(timer);
      // 🔑 Arrêter l'audio via la référence
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, [onClose]);

  return (
    <div className="starwars-overlay">
      <button className="starwars-close" onClick={onClose} aria-label="Fermer">
        <X size={32} />
      </button>

      {/* Étoiles de fond */}
      {stars.map((star, index) => (
        <div
          key={index}
          className="star"
          style={{ top: `${star.top}px`, left: `${star.left}px` }}
        />
      ))}

      {/* Intro "A long time ago..." */}
      <section className="intro">
        A long time ago, in a galaxy far,<br /> far away....
      </section>

      {/* Logo TraceVault stylisé Star Wars */}
      <section className="logo">
        <svg viewBox="0 0 693.615 419.375" xmlns="http://www.w3.org/2000/svg">
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#FFE81F"
            fontSize="120"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
            letterSpacing="8"
          >
            TRACEVAULT
          </text>
        </svg>
      </section>

      {/* Texte défilant */}
      <div id="starwars-board">
        <div id="starwars-content">
          <p id="starwars-title">Episode I</p>
          <p id="starwars-subtitle">THE BLOCKCHAIN AWAKENS</p>
          <br />
          <p>
            Dans un monde où la confiance numérique est devenue cruciale,
            une nouvelle technologie émerge des profondeurs de l'innovation.
          </p>
          <br />
          <p>
            <strong>TRACEVAULT</strong>, un système révolutionnaire de certification
            blockchain, se dresse comme un rempart contre la falsification et
            la manipulation de documents.
          </p>
          <br />
          <p>
            Développé par <strong>Pablo MERIDJEN-MANOUKIAN</strong>, avec le
            soutien précieux des consultants <strong>Eric Izquierdo</strong>,
            <strong>Marc Rouchvarger</strong>, <strong>Joachim Ménager</strong> et
            <strong>Gary Wajdenbaum</strong>, ce projet incarne l'alliance
            parfaite entre sécurité et transparence.
          </p>
          <br />
          <p>
            Chaque document authentifié devient un NFT unique, gravé à jamais
            dans les annales immuables de la blockchain Ethereum. Les labels
            certifient l'authenticité, tandis que les classeurs préservent
            l'historique complet des versions.
          </p>
          <br />
          <p>
            Grâce à la puissance de <strong>Wagmi</strong>, <strong>Viem</strong> et
            <strong>RainbowKit</strong>, les utilisateurs peuvent interagir avec
            leurs certificats en toute simplicité, que ce soit sur Sepolia
            ou sur le réseau principal.
          </p>
          <br />
          <p>
            Les smart contracts, rédigés en <strong>Solidity 0.8.28</strong> et
            optimisés avec ERC721A, garantissent une efficacité maximale
            tout en minimisant les coûts de gas.
          </p>
          <br />
          <p>
            IPFS et Pinata assurent le stockage décentralisé des métadonnées,
            rendant chaque certificat accessible pour l'éternité, résistant
            à la censure et à l'effacement.
          </p>
          <br />
          <p>
            Mais attention ! Le côté obscur de la blockchain existe toujours.
            Les attaques par frontrunning, les exploits de réentrance et les
            vulnérabilités des oracles rôdent dans l'ombre.
          </p>
          <br />
          <p>
            C'est pourquoi TraceVault a été forgé avec les meilleures pratiques
            de sécurité : validations rigoureuses, mappings optimisés, et
            une architecture testée par les maîtres Jedi du développement blockchain.
          </p>
          <br />
          <p>
            Aujourd'hui, alors que vous lisez ces lignes, des milliers de
            documents attendent d'être certifiés. Des labels à créer.
            Des versions à enregistrer. Des vérités à préserver.
          </p>
          <br />
          <p>
            La Force de la blockchain est avec vous. Utilisez-la sagement.
          </p>
          <br />
          <p>
            Que la décentralisation soit avec vous, toujours.
          </p>
          <br />
          {isMay4th() && (
            <>
              <br />
              <p style={{ fontSize: '1.5em', textAlign: 'center' }}>
                🎉 <strong>MAY THE 4TH BE WITH YOU!</strong> 🎉
              </p>
              <br />
              <p style={{ textAlign: 'center' }}>
                Aujourd'hui est un jour spécial pour tous les fans de Star Wars
                et... de TraceVault ! Merci d'avoir découvert cet Easter Egg !
              </p>
            </>
          )}
          <br />
          <br />
          <p style={{ textAlign: 'center', fontSize: '0.8em', opacity: 0.6 }}>
            Easter Egg activé avec le code secret : <strong>"moustache"</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
