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
import { pinataInfo } from '@/utils/client';
import { toast } from 'sonner';

const BuildLabel = () => {

    const [compareOnlineReady, setcompareOnlineReady] = useState(false);
    const [hashRecorded, setHashRecorded] = useState("");
    const [nameLabel, setNameLabel] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isCreatingNFT, setIsCreatingNFT] = useState(false);
    const [imageIpfsHash, setImageIpfsHash] = useState<string>("");
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

    // Fonction pour recevoir le fichier depuis Parcourir (stockage uniquement)
    const handleFileFromParcourir = (file: File) => {
      setImageFile(file);
      toast.success('Fichier sélectionné', {
        description: `${file.name} prêt à être uploadé`
      });
    };

    const cancelHash = () => {
    setcompareOnlineReady(false);
    setHashRecorded("");
    setImageFile(null);
  }

  // Fonction pour créer le NFT Label
  const creerLabelNft = async () => {
    if (!nameLabel || !imageFile) {
      toast.error('Champs manquants', {
        description: 'Veuillez remplir le nom du produit et sélectionner une image'
      });
      return;
    }

    setIsCreatingNFT(true);

    try {
      // ÉTAPE 1 : Upload de l'image sur IPFS
      toast.info('Upload en cours...', {
        description: 'Téléversement de l\'image sur IPFS'
      });

      const formData = new FormData();
      formData.append('file', imageFile);

      const imageResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${pinataInfo.JWT}`
        },
        body: formData
      });

      if (!imageResponse.ok) {
        throw new Error('Échec de l\'upload de l\'image');
      }

      const imageData = await imageResponse.json();
      const uploadedImageHash = imageData.IpfsHash;
      // Stocker le hash IPFS de l'image dans le state
      setImageIpfsHash(uploadedImageHash);
      toast.success('Image uploadée !', {
        description: `IPFS: ${uploadedImageHash}`
      });

      // ÉTAPE 2 : Création et upload du JSON des métadonnées
      const metadata = {
        name: nameLabel,
        description: `Certificat NFT d'authenticité pour ${nameLabel}`,
        image: `ipfs://${uploadedImageHash}`,
        attributes: [
          {
            trait_type: "Product Hash",
            value: hashRecorded
          },
          {
            trait_type: "Creation Date",
            value: new Date().toISOString()
          }
        ]
      };

      const jsonResponse = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${pinataInfo.JWT}`
        },
        body: JSON.stringify(metadata)
      });

      if (!jsonResponse.ok) {
        throw new Error('Échec de l\'upload des métadonnées');
      }

      const jsonData = await jsonResponse.json();
      const metadataIpfsHash = jsonData.IpfsHash;

      toast.success('Métadonnées créées !', {
        description: `JSON IPFS: ${metadataIpfsHash}`
      });

      // ÉTAPE 3 : Écriture sur la blockchain
      toast.info('Transaction blockchain', {
        description: 'Envoi de la transaction au smart contract...'
      });

      writeContract({
        address: ADRESS_CONTRACT as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'mintCertif',
        args: [nameLabel, hashRecorded, metadataIpfsHash],
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
    if (isSuccess && imageIpfsHash) {
      toast.success('NFT créé avec succès !', {
        description: 'Redirection vers la page de vérification...'
      });

      setTimeout(() => {
        const params = new URLSearchParams({
          message: hashRecorded,
          label: 'true',
          productName: nameLabel,
          photoUrl: imageIpfsHash
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
  }, [isSuccess, isError, hashRecorded, nameLabel, imageIpfsHash, router]);

  return (
    <div className={`verifier-container ${styles.page}`}>
      <div className="verifier-content">
        <h1 className="verifier-title">Créer une étiquette de produit</h1>
        <p className="verifier-subtitle">Choisissez une méthode de vérification</p>

        <div className="verifier-methods">
          <div className="verify-method-card">
            <div className="method-header">
              <Upload size={40} />
              <h2>Uploader la photo de l'objet</h2>
            </div>
            <div
              className="method-body clickable"
              onClick={() => parcourirRef.current?.triggerFileInput()}
              style={{ cursor: 'pointer' }}
            >
              <Parcourir ref={parcourirRef} recordHashQr={verifyQrCode} label={true} setFileFromParcourir={handleFileFromParcourir}/>
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
              <p>Voulez-vous Créer un NFT label d'authentification de l'objet ?</p>
              <div className="infos-complementaires-label">
                <p>Nom du Produit</p>
                <input
                  type="text"
                  value={nameLabel}
                  onChange={(e) => setNameLabel(e.target.value)}
                  placeholder="Entrez le nom du produit..."
                />
                <p>Photo du produit</p>
                {imageFile ? (
                  <div>
                    <p><strong>Fichier sélectionné :</strong> {imageFile.name}</p>
                    <p className="file-status file-status--ready">✓ Prêt à être uploadé</p>
                  </div>
                ) : (
                  <p className="file-status file-status--missing">Aucun fichier sélectionné</p>
                )}
              </div>
              <div className="modal-actions">
                <button
                  className="btn-confirm"
                  onClick={creerLabelNft}
                  disabled={!nameLabel || !imageFile || isCreatingNFT}
                >
                  {isCreatingNFT ? <Loader2 size={20} className="spinner" /> : <CheckCircle size={20} />}
                  {isCreatingNFT ? 'Création en cours...' : 'Créer un NFT Label'}
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

export default BuildLabel