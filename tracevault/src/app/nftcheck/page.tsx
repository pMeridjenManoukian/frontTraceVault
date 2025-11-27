"use client";

import React from 'react'
import { useSearchParams } from 'next/navigation';
import Nftcard from '@/components/shared/nftcard';

export default function NftCheck() {
  const searchParams = useSearchParams();
  const hash = searchParams.get('hash');
  const isEtiquette = searchParams.get('isEtiquette') === 'true';
  const isNft = searchParams.get('isNft') === 'true';

  // ✅ Gérer le cas où hash est null
  if (!hash) {
    return (
      <div className="NFT-titre">
        ❌ Aucun hash fourni dans l'URL
      </div>
    );
  }

  return (
    <div>
      <div className="NFT-titre">VERIFIER UN ELEMENT</div>
      <Nftcard 
        hashlocal={hash} 
        isEtiquette={isEtiquette} 
        isNft={isNft}
      />
    </div>
  )
}


export default NftCheck