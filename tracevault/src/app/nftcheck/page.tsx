"use client";

import React from 'react'
import { useSearchParams } from 'next/navigation';
import Nftcard from '@/components/shared/nftcard';
import { useState } from 'react';

export default function NftCheck() {
  const searchParams = useSearchParams();
  const hash = searchParams.get('message') ?? 'no hash';
      const [isEtiquette, setisEtiquette] = useState(true);
    const [isNft, setisNft] = useState(hash === "no hash" ? false : true);
  // ✅ Gérer le cas où hash est null
const nohash = (
    
        <div>❌ Aucun hash fourni dans l'URL</div>
      
)
const yeshash = (
<Nftcard 
                hashlocal={hash} 
                isEtiquette={isEtiquette} 
                isNft={isNft}
                />
)
  if (hash === "nohash") {
    return (
      <div className="nftcheck">
        {nohash}
      </div>
    );
  } else {
      return (
          <div className="nftcheck">
            <div>
            cliquez sur boutons ci dessous pour voir les differentes cartes
            <div onClick={() => setisNft(!isNft)} className={`button ${isNft ? 'vert' : 'rouge'}`}>NFT ?</div>
            <div onClick={() => setisEtiquette(!isEtiquette)} className={`button ${isEtiquette ? 'vert' : 'rouge'}`}>ETIQUETTE ?</div>
            </div>
            <div className="NFT-titre">VERIFIER UN ELEMENT</div>
            <div className="NFT-titre">VERIFIER UN ELEMENT</div>
            {yeshash}
        </div>
    )
    }
}