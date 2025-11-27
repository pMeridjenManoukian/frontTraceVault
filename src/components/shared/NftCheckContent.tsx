"use client";

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Nftcard from '@/components/shared/nftcard';

export default function NftCheckContent() {
  const searchParams = useSearchParams();
  const hash = searchParams.get('message') ?? 'nohash';
  const [isEtiquette, setIsEtiquette] = useState(true);
  const [isNft, setIsNft] = useState(hash !== "nohash");

  if (hash === "nohash") {
    return (
      <div className="nftcheck">
        <div className="NFT-titre">❌ Aucun hash fourni dans l'URL</div>
        <p>Ajoutez <code>?message=VOTRE_HASH</code> à l'URL</p>
      </div>
    );
  }

  return (
    <div className="nftcheck">
      <div>
        <p>Cliquez sur les boutons ci-dessous pour voir les différentes cartes</p>
        <div className="button-group">
          <button 
            onClick={() => setIsNft(!isNft)} 
            className={`button ${isNft ? 'vert' : 'rouge'}`}
          >
            {isNft ? '✓' : '✗'} NFT
          </button>
          <button 
            onClick={() => setIsEtiquette(!isEtiquette)} 
            className={`button ${isEtiquette ? 'vert' : 'rouge'}`}
          >
            {isEtiquette ? '✓' : '✗'} ETIQUETTE
          </button>
        </div>
      </div>
      
      <div className="NFT-titre">VÉRIFIER UN ÉLÉMENT</div>
      
      <Nftcard 
        hashlocal={hash} 
        isEtiquette={isEtiquette} 
        isNft={isNft}
      />
    </div>
  );
}
