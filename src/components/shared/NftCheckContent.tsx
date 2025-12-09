"use client";

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Nftcard from '@/components/shared/nftcard';

export default function NftCheckContent() {
  const searchParams = useSearchParams();

  // 📝 Récupération de tous les paramètres
  const hash = searchParams.get('message') ?? 'nohash';
  const source = searchParams.get('source'); // 'verification' ou 'creation'
  const tokenId = searchParams.get('tokenId');
  const typeCertif = searchParams.get('typeCertif');
  const proprietaire = searchParams.get('proprietaire');
  const metadataURI = searchParams.get('metadataURI');

  // Données spécifiques LABEL
  const productName = searchParams.get('productName');

  // Données spécifiques CLASSEUR
  const versionActuelle = searchParams.get('versionActuelle');
  const totalVersions = searchParams.get('totalVersions');
  const estDerniereVersion = searchParams.get('estDerniereVersion') === 'true';
  const hashDerniereVersion = searchParams.get('hashDerniereVersion');
  const dateCreation = searchParams.get('dateCreation');

  // Ancienne méthode (pour compatibilité avec buildLabel)
  const isLabelFromOldMethod = searchParams.get('label') === 'true';
  const photoUrlOldMethod = searchParams.get('photoUrl');

  // 🎯 Déterminer le type de certificat
  const isLabel = typeCertif === '0' || isLabelFromOldMethod;
  const isFromVerification = source === 'verification';

  // Debug logs
  console.log('📋 NftCheckContent - Paramètres reçus:');
  console.log('  - photoUrlOldMethod:', photoUrlOldMethod);
  console.log('  - metadataURI:', metadataURI);
  console.log('  - isLabelFromOldMethod:', isLabelFromOldMethod);
  console.log('  - productName:', productName);

  const [isEtiquette, setIsEtiquette] = useState(isLabel ? false : true);
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
      {/* Boutons de debug (seulement si pas de source définie) */}
      {!source && !isLabelFromOldMethod && (
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
      )}

      {/* Titre dynamique */}
      <div className="NFT-titre">
        {isLabelFromOldMethod && 'CERTIFICAT NFT CRÉÉ AVEC SUCCÈS !'}
        {isFromVerification && (isLabel ? '🏷️ CERTIFICAT NFT VÉRIFIÉ' : '📁 DOCUMENT CERTIFIÉ')}
        {!isLabelFromOldMethod && !isFromVerification && 'VÉRIFIER UN ÉLÉMENT'}
      </div>

      {/* Informations détaillées (si vérification) */}
      {isFromVerification && tokenId && (
        <div className="blockchain-info">
          <h3>📋 Informations blockchain</h3>
          <div className="blockchain-info__content">
            <p><strong>Token ID:</strong> #{tokenId}</p>
            <p><strong>Type:</strong> {isLabel ? '🏷️ Label/Étiquette' : '📁 Classeur/Document'}</p>
            <p><strong>Propriétaire:</strong> <code>{proprietaire}</code></p>

            {!isLabel && (
              <>
                <p><strong>Version:</strong> {versionActuelle} / {totalVersions}</p>
                <p><strong>Statut:</strong> {estDerniereVersion ? '✅ Dernière version' : '⚠️ Version obsolète'}</p>
                {dateCreation && (
                  <p><strong>Date création:</strong> {new Date(Number(dateCreation) * 1000).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                )}
                {!estDerniereVersion && hashDerniereVersion && (
                  <p className="blockchain-info__latest-version">
                    💡 <strong>Dernière version disponible</strong><br/>
                    <code>{hashDerniereVersion}</code>
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Carte NFT */}
      <Nftcard
        hashlocal={hash}
        isEtiquette={isEtiquette}
        isNft={isNft}
        productName={productName || undefined}
        photoUrl={photoUrlOldMethod || metadataURI || undefined}
        tokenId={tokenId || undefined}
        isFromVerification={isFromVerification}
        versionInfo={!isLabel ? {
          current: versionActuelle || '1',
          total: totalVersions || '1',
          isLast: estDerniereVersion
        } : undefined}
      />
    </div>
  );
}
