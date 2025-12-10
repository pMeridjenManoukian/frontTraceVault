"use client";

import { useState, useEffect } from 'react';
import styles from "../page.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { Upload, CheckCircle, XCircle, Loader2, QrCode } from 'lucide-react';
import Parcourir from '@/components/shared/parcourir';
import Qrcode from '@/components/shared/qrcode';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseEther } from 'viem';
import { ADRESS_CONTRACT, CONTRACT_ABI } from '@/utils/constants';
import { toast } from 'sonner';

const BuildVersion = () => {

    const [oldHash, setOldHash] = useState("");
    const [newHash, setNewHash] = useState("");
    const [oldDocumentFile, setOldDocumentFile] = useState<File | null>(null);
    const [newDocumentFile, setNewDocumentFile] = useState<File | null>(null);
    const [isCreatingVersion, setIsCreatingVersion] = useState(false);
    const [step, setStep] = useState<'old' | 'new'>('old');
    const [compareOnlineReady, setCompareOnlineReady] = useState(false);

    const { data: hash, writeContract, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess, isError } = useWaitForTransactionReceipt({ hash });

    const router = useRouter();
    const searchParams = useSearchParams();
    const choixnft = searchParams.get('choixnft');

    const handleOldFileHash = (code: string) => {
      if(code !== "" && code !== null && code !== undefined) {
        console.log("Hash de l'ancienne version:", code)
        setOldHash(code);
        // Si c'est un QR code, on n'a pas de fichier, donc on passe directement à l'étape suivante
        setStep('new');
      }
    }

    // Fonction spécifique pour le QR code de l'ancienne version
    const handleOldQrCode = (code: string) => {
      if(code !== "" && code !== null && code !== undefined) {
        console.log("Hash de l'ancienne version (QR):", code)
        setOldHash(code);
        // Pas de fichier pour QR code, on simule juste pour l'affichage
        setStep('new');
        toast.success('Version actuelle identifiée', {
          description: `Hash scanné depuis le QR code`
        });
      }
    }

    const handleNewFileHash = (code: string) => {
      if(code !== "" && code !== null && code !== undefined) {
        console.log("Hash de la nouvelle version:", code)
        setNewHash(code);
        setCompareOnlineReady(true);
      }
    }

    const handleOldFileFromParcourir = (file: File) => {
      setOldDocumentFile(file);
      toast.success('Version actuelle sélectionnée', {
        description: `${file.name}`
      });
    };

    const handleNewFileFromParcourir = (file: File) => {
      setNewDocumentFile(file);
      toast.success('Nouvelle version sélectionnée', {
        description: `${file.name}`
      });
    };

    const cancelHash = () => {
      setCompareOnlineReady(false);
      setOldHash("");
      setNewHash("");
      setOldDocumentFile(null);
      setNewDocumentFile(null);
      setStep('old');
    }

  // Fonction pour créer la nouvelle version
  const creerNouvelleVersion = async () => {
    // Vérifier qu'on a au moins les hash (fichier pas obligatoire si QR code)
    if (!oldHash || !newDocumentFile) {
      toast.error('Informations manquantes', {
        description: 'Veuillez identifier la version actuelle et sélectionner la nouvelle version'
      });
      return;
    }

    if (oldHash === newHash) {
      toast.error('Fichiers identiques', {
        description: 'Les deux fichiers ont le même hash. Aucune modification détectée.'
      });
      return;
    }

    setIsCreatingVersion(true);

    try {
      toast.info('Transaction blockchain', {
        description: 'Ajout de la nouvelle version au classeur...'
      });

      console.log('📝 Paramètres de la transaction:');
      console.log('  - Hash précédent:', oldHash);
      console.log('  - Nouveau hash:', newHash);
      console.log('  - Address:', ADRESS_CONTRACT);

      writeContract({
        address: ADRESS_CONTRACT as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'mintNouvelleVersion',
        args: [oldHash, newHash],
        value: parseEther('0.0002')
      });

      console.log('✅ writeContract appelé');

    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Échec de la création', {
        description: error instanceof Error ? error.message : 'Une erreur est survenue'
      });
      setIsCreatingVersion(false);
    }
  };

  // État pour activer la récupération des infos uniquement après succès
  const [shouldFetchInfo, setShouldFetchInfo] = useState(false);

  // Appel pour récupérer les infos du hash après succès
  const { data: hashInfo } = useReadContract({
    address: ADRESS_CONTRACT as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getHashInfo',
    args: [newHash || ""],
    query: {
      enabled: shouldFetchInfo && !!newHash && isSuccess
    }
  });

  // Gestion du succès/échec de la transaction blockchain
  useEffect(() => {
    if (isSuccess && newHash && !shouldFetchInfo) {
      console.log('🎉 Nouvelle version créée avec succès!');

      toast.success('Nouvelle version ajoutée avec succès !', {
        description: 'Récupération des informations...'
      });

      // Activer la récupération des infos
      setShouldFetchInfo(true);
    }

    if (isError) {
      toast.error('Transaction échouée', {
        description: 'La transaction blockchain a échoué'
      });
      setIsCreatingVersion(false);
    }
  }, [isSuccess, isError, newHash, shouldFetchInfo]);

  // Gestion de la redirection après récupération des infos
  useEffect(() => {
    if (hashInfo && shouldFetchInfo) {
      console.log('📊 Informations récupérées:', hashInfo);

      setTimeout(() => {
        const params = new URLSearchParams({
          message: newHash,
          source: 'creation',
          typeCertif: '1', // CLASSEUR
          versionActuelle: hashInfo.versionActuelle?.toString() || '1',
          totalVersions: hashInfo.totalVersions?.toString() || '1',
          estDerniereVersion: 'true'
        });
        console.log('📤 Redirection vers nftcheck avec version:', hashInfo.versionActuelle, '/', hashInfo.totalVersions);
        router.push(`/nftcheck?${params.toString()}`);
      }, 1000);
    }
  }, [hashInfo, shouldFetchInfo, newHash, router]);

  return (
    <div className={`verifier-container ${styles.page}`}>
      <div className="verifier-content">
        <h1 className="verifier-title">Ajouter une nouvelle version</h1>
        <p className="verifier-subtitle">Sélectionnez l'ancienne et la nouvelle version du document</p>

        <div className="verifier-methods">
          {/* Étape 1 : Version actuelle */}
          <div className="verify-method-card">
            <div className="method-header">
              <Upload size={40} />
              <h2>1. Uploader la version actuelle</h2>
              {oldDocumentFile && <span className="step-completed">✓</span>}
            </div>
            <div className="method-body">
              <Parcourir
                recordHashQr={handleOldFileHash}
                setFileFromParcourir={handleOldFileFromParcourir}
              />
            </div>
          </div>

          <div className="verify-method-card">
            <div className="method-header">
              <QrCode size={40} />
              <h2>1. Scanner le QR code de la version actuelle</h2>
              {oldHash && !oldDocumentFile && <span className="step-completed">✓</span>}
            </div>
            <div className="method-body">
              <Qrcode recordHashQr={handleOldQrCode}/>
            </div>
          </div>

          {/* Étape 2 : Nouvelle version */}
          {step === 'new' && (
            <div className="verify-method-card">
              <div className="method-header">
                <Upload size={40} />
                <h2>2. Nouvelle version</h2>
                {newDocumentFile && <span className="step-completed">✓</span>}
              </div>
              <div className="method-body">
                <Parcourir
                  recordHashQr={handleNewFileHash}
                  setFileFromParcourir={handleNewFileFromParcourir}
                />
              </div>
            </div>
          )}
        </div>

        {compareOnlineReady && (
          <div className="hash-confirmation-modal">
            <div className="modal-content">
              <h3>Confirmation de la nouvelle version</h3>

              <div className="version-comparison">
                <div className="version-block">
                  <p className="version-label">Version actuelle</p>
                  <p className="hash-display">
                    <code>{oldHash.substring(0, 16)}...{oldHash.substring(oldHash.length - 16)}</code>
                  </p>
                  <p><strong>Fichier :</strong> {oldDocumentFile?.name || 'Identifié via QR code'}</p>
                </div>

                <div className="version-arrow">→</div>

                <div className="version-block">
                  <p className="version-label">Nouvelle version</p>
                  <p className="hash-display">
                    <code>{newHash.substring(0, 16)}...{newHash.substring(newHash.length - 16)}</code>
                  </p>
                  <p><strong>Fichier :</strong> {newDocumentFile?.name}</p>
                </div>
              </div>

              <p>Voulez-vous ajouter cette nouvelle version au classeur ?</p>

              <div className="modal-actions">
                <button
                  className="btn-confirm"
                  onClick={creerNouvelleVersion}
                  disabled={!oldHash || !newDocumentFile || isCreatingVersion}
                >
                  {isCreatingVersion ? <Loader2 size={20} className="spinner" /> : <CheckCircle size={20} />}
                  {isCreatingVersion ? 'Création en cours...' : 'Ajouter la nouvelle version'}
                </button>
                <button className="btn-cancel" onClick={cancelHash} disabled={isCreatingVersion}>
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

export default BuildVersion