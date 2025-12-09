"use client";

import { useState } from 'react'
import styles from "../page.module.css";
import { useRouter } from "next/navigation";
import { QrCode, Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useReadContract } from 'wagmi';
import { toast } from 'sonner';
import Qrcode from '@/components/shared/qrcode';
import Parcourir from '@/components/shared/parcourir';
import { ADRESS_CONTRACT, CONTRACT_ABI } from '@/utils/constants';
import { fetchNftMetadata, getImageFromMetadata } from '@/utils/ipfs';

export default function Verifier() {
  const [compareOnlineReady, setcompareOnlineReady] = useState(false)
  const [hashRecorded, setHashRecorded] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const router = useRouter();

  // 🔥 Lecture du smart contract avec wagmi
  const { data: hashInfo, isLoading, isError, refetch } = useReadContract({
    address: ADRESS_CONTRACT as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getHashInfo',
    args: [hashRecorded],
    query: {
      enabled: false, // On ne lance pas automatiquement, seulement au clic
    }
  });

  const verifyQrCode = (code: string) => {
    if(code !== "" && code !== null && code !== undefined) {
      console.log("Hash détecté:", code)
      setcompareOnlineReady(true);
      setHashRecorded(code);
    } else { setcompareOnlineReady(false) }
  }

  const cancelHash = () => {
    setcompareOnlineReady(false);
    setHashRecorded("")
  }

  const approuveHash = async () => {
    console.log('🔍 Vérification du hash:', hashRecorded)
    setIsVerifying(true);

    try {
      // 🚀 Appel au smart contract
      const result = await refetch();

      if (result.isError || !result.data) {
        toast.error('❌ Hash non trouvé dans la blockchain');
        setIsVerifying(false);
        return;
      }

      const info = result.data as any;
      console.log('📦 Données récupérées:', info);

      // 🎯 Construire l'URL avec toutes les infos nécessaires
      const isLabel = Number(info.typeCertif) === 0;

      // 📸 Récupérer le JSON metadata depuis IPFS pour extraire le hash de l'image
      let ipfsImageHash = '';
      if (info.metadataURI && isLabel) {
        const metadata = await fetchNftMetadata(info.metadataURI);
        if (metadata) {
          ipfsImageHash = getImageFromMetadata(metadata);
          console.log('🖼️ Hash image extrait:', ipfsImageHash);
        } else {
          toast.error('⚠️ Impossible de charger l\'image du NFT');
        }
      }

      const params = new URLSearchParams({
        message: hashRecorded,
        source: 'verification', // Pour différencier de la création
        tokenId: info.tokenId.toString(),
        typeCertif: info.typeCertif.toString(),
        isLabel: isLabel.toString(),
        proprietaire: info.proprietaire,
        metadataURI: info.metadataURI,
      });

      // Ajouter les données spécifiques selon le type
      if (isLabel) {
        params.append('productName', info.nomProduit);
        // Ajouter le hash IPFS de l'image (extrait du JSON metadata)
        if (ipfsImageHash) {
          params.append('photoUrl', ipfsImageHash);
        }
      } else {
        params.append('versionActuelle', info.versionActuelle.toString());
        params.append('totalVersions', info.totalVersions.toString());
        params.append('estDerniereVersion', info.estDerniereVersion.toString());
        params.append('hashDerniereVersion', info.hashDerniereVersion);
        params.append('dateCreation', info.dateCreation);
      }

      toast.success('✅ Hash vérifié avec succès !');
      router.push(`/nftcheck?${params.toString()}`);
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      toast.error('❌ Erreur lors de la vérification');
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <div className={`verifier-container ${styles.page}`}>
      <div className="verifier-content">
        <h1 className="verifier-title">Vérifier un document</h1>
        <p className="verifier-subtitle">Choisissez une méthode de vérification</p>

        <div className="verifier-methods">
          <div className="verify-method-card">
            <div className="method-header">
              <Upload size={40} />
              <h2>Uploader un fichier</h2>
            </div>
            <div className="method-body">
              <Parcourir recordHashQr={verifyQrCode}/>
            </div>
          </div>

          <div className="verify-method-card">
            <div className="method-header">
              <QrCode size={40} />
              <h2>Scanner un QR Code</h2>
            </div>
            <div className="method-body">
              <Qrcode recordHashQr={verifyQrCode}/>
            </div>
          </div>
        </div>

        {compareOnlineReady && (
          <div className="hash-confirmation-modal">
            <div className="modal-content">
              <h3>Confirmation de vérification</h3>
              <p className="hash-display">
                Hash détecté: <code>{hashRecorded}</code>
              </p>
              <p>Voulez-vous vérifier l'authenticité de ce document ?</p>
              <div className="modal-actions">
                <button
                  className="btn-confirm"
                  onClick={approuveHash}
                  disabled={isVerifying}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Vérification...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      Vérifier
                    </>
                  )}
                </button>
                <button
                  className="btn-cancel"
                  onClick={cancelHash}
                  disabled={isVerifying}
                >
                  <XCircle size={20} />
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}