"use client";

import React, { useState } from 'react'
import styles from "../page.module.css";
import Link from 'next/link';
import { BadgeCheck, ClipboardPlus, SquareStar, FilePlusCorner } from 'lucide-react';


const authentifier = () => {

  const [choixDoc, setchoixDoc] = useState(false); 

  const choix1 = (
    <div className="choix-cards">
          <Link href="/buildLabel?choixnft=etiquette" className="choix-card choix-verifier">
            <div className="choix-card-icon">
              <SquareStar size={80} />
            </div>
            <h2 className="choix-card-title">Authentifier un objet</h2>
            <p className="choix-card-description">
              Authentifiez un objet en créant une étiquette NFT éternel dans la blockchain
            </p>
            <div className="choix-card-action">
              Créer une un certificat d'authenticité NFT →
            </div>
          </Link>

          <div onClick={()=> setchoixDoc(true)} className="choix-card choix-authentifier">
            <div className="choix-card-icon">
              <ClipboardPlus size={80} />
            </div>
            <h2 className="choix-card-title">Authentifier un document ou une nouvelle version</h2>
            <p className="choix-card-description">
              Authentifier un nouveau document numérique ou authentifier une nouvelle version d'un document existant
            </p>
            <div className="choix-card-action">
              Créer une authentification de document →
            </div>
          </div>
        </div>
  );

  const choix2 = (
<div className="choix-cards">
          <Link href="/builDocument?choixnft=document" className="choix-card choix-verifier">
            <div className="choix-card-icon">
              <ClipboardPlus size={80} />
            </div>
            <h2 className="choix-card-title">Authentifier nouveau document</h2>
            <p className="choix-card-description">
             Vous pouvez authentifier n'importe quel fichier numérique, un document, un tableur Excel, une video, musique ...
            </p>
            <div className="choix-card-action">
              Authentifier un nouveau document numérique →
            </div>
          </Link>

          <Link href="/buildVersion?choixnft=version" className="choix-card choix-authentifier">
            <div className="choix-card-icon">
              <FilePlusCorner size={80} />
            </div>
            <h2 className="choix-card-title">Authentifier une nouvelle version</h2>
            <p className="choix-card-description">
              Si votre fichier numérique présente une nouvelle version, vous vouvez historiser l'authentification
            </p>
            <div className="choix-card-action">
              Créer une authentification de version →
            </div>
          </Link>
        </div>
  );
  return (
    
    <div className={`choix-container ${styles.page}`}>
      <div className="choix-content">
        <h1 className="choix-main-title">Que souhaitez-vous faire ?</h1>
        {
          !choixDoc ? choix1 : choix2 
        }
        
        
      </div>
    </div>
  )
}

export default authentifier