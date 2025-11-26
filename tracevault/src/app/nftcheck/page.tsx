"use client";

import React from 'react'
import {useState} from 'react'
import { useSearchParams } from 'next/navigation';
import Nftcard from '@/components/shared/nftcard';




const NftCheck = () => {
    const searchParams = useSearchParams();
    const hash  = searchParams.get('message');
    const [isEtiquette, setisEtiquette] = useState(true);
    const [isNft, setisNft] = useState(true);

  return (
    <div className="nftcheck">
        <div>
            cliquez sur boutons ci dessous pour voir les differentes cartes
            <div onClick={() => setisNft(!isNft)} className={`button ${isNft ? 'vert' : 'rouge'}`}>NFT ?</div>
            <div onClick={() => setisEtiquette(!isEtiquette)} className={`button ${isEtiquette ? 'vert' : 'rouge'}`}>ETIQUETTE ?</div>
            </div>
            <div className="NFT-titre">VERIFIER UN ELEMENT</div>
            
        <Nftcard hashlocal={hash} isEtiquette={isEtiquette} isNft={isNft}/>
    </div>
  )
}

export default NftCheck