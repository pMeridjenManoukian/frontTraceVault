"use client";

import { useState, useEffect, useRef } from 'react';
import styles from "../page.module.css";
import { useRouter } from "next/navigation";
import { QrCode, Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Qrcode from '@/components/shared/qrcode';
import Parcourir, { ParcourirRef } from '@/components/shared/parcourir';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { ADRESS_CONTRACT, CONTRACT_ABI } from '@/utils/constants';
import { toast } from 'sonner';

const BuildDocument = () => {

    const [compareOnlineReady, setcompareOnlineReady] = useState(false)
    const [hashRecorded, setHashRecorded] = useState("");
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const [isCreatingNFT, setIsCreatingNFT] = useState(false);
    const parcourirRef = useRef<ParcourirRef>(null);

    const { data: hash, writeContract, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess, isError } = useWaitForTransactionReceipt({ hash });

    const router = useRouter();

    const verifyQrCode = (code: string) => {
      if(code !== "" && code !== null && code !== undefined) {
        setcompareOnlineReady(true);
        setHashRecorded(code);
      } else { setcompareOnlineReady(false) }
    }

    // Fonction pour recevoir le fichier depuis Parcourir
    const handleFileFromParcourir = (file: File) => {
      setDocumentFile(file);
      toast.success('Fichier sélectionné', {
        description: `${file.name} prêt à être enregistré`
      });
    };

    const cancelHash = () => {
    setcompareOnlineReady(false);
    setHashRecorded("");
    setDocumentFile(null);
  }

  // Fonction pour créer le NFT Document (Classeur)
  const creerDocumentNft = async () => {
    if (!documentFile) {
      toast.error('Fichier manquant', {
        description: 'Veuillez sélectionner un document'
      });
      return;
    }

    setIsCreatingNFT(true);
    try {
      // Création directe sur la blockchain (pas d'upload IPFS pour les documents)
      toast.info('Transaction blockchain', {
        description: 'Envoi de la transaction au smart contract...'
      });

      // Pour les documents, on ne stocke pas sur IPFS, donc on passe une valeur placeholder
      const placeholderIpfs = "QmNoPinata"; // Placeholder pour indiquer que le fichier n'est pas sur IPFS

      writeContract({
        address: ADRESS_CONTRACT as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'mintNouveauClasseur',
        args: [hashRecorded, placeholderIpfs],
        value: parseEther('0.0002')
      });

    } catch (error) {
      toast.error('Échec de la création', {
        description: error instanceof Error ? error.message : 'Une erreur est survenue'
      });
      setIsCreatingNFT(false);
    }
  };

  // Gestion du succès/échec de la transaction blockchain
  useEffect(() => {
    if (isSuccess) {
      toast.success('NFT Document créé avec succès !', {
        description: 'Redirection vers la page de vérification...'
      });

      setTimeout(() => {
        const params = new URLSearchParams({
          message: hashRecorded,
          source: 'creation',
          typeCertif: '1', // CLASSEUR
          versionActuelle: '1',
          totalVersions: '1',
          estDerniereVersion: 'true'
        });
        router.push(`/nftcheck?${params.toString()}`);
      }, 2000);
    }

    if (isError) {
      toast.error('Transaction échouée', {
        description: 'La transaction blockchain a échoué'
      });
      setIsCreatingNFT(false);
    }
  }, [isSuccess, isError, hashRecorded, router]);

  return (
    <div className={`verifier-container ${styles.page}`}>
      <div className="verifier-content">
        <h1 className="verifier-title">Authentifier un fichier</h1>
        <p className="verifier-subtitle">Choisissez une méthode de vérification</p>

        <div className="verifier-methods">
          <div className="verify-method-card">
            <div className="method-header">
              <Upload size={40} />
              <h2>Uploader un fichier</h2>
            </div>
            <div
              className="method-body clickable"
              onClick={() => parcourirRef.current?.triggerFileInput()}
              style={{ cursor: 'pointer' }}
            >
              <Parcourir ref={parcourirRef} recordHashQr={verifyQrCode} setFileFromParcourir={handleFileFromParcourir}/>
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
              <p>Voulez-vous créer un NFT Document pour ce fichier ?</p>
              <div className="infos-complementaires-label">
                <p>Fichier du document</p>
                {documentFile ? (
                  <div>
                    <p><strong>Fichier sélectionné :</strong> {documentFile.name}</p>
                    <p className="file-status file-status--ready">✓ Prêt à être uploadé</p>
                  </div>
                ) : (
                  <p className="file-status file-status--missing">Aucun fichier sélectionné</p>
                )}
              </div>
              <div className="modal-actions">
                <button
                  className="btn-confirm"
                  onClick={creerDocumentNft}
                  disabled={!documentFile || isCreatingNFT}
                >
                  {isCreatingNFT ? <Loader2 size={20} className="spinner" /> : <CheckCircle size={20} />}
                  {isCreatingNFT ? 'Création en cours...' : 'Créer un NFT Document'}
                </button>
                <button className="btn-cancel" onClick={cancelHash} disabled={isCreatingNFT}>
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

export default BuildDocument