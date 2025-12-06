"use client";

import { useState } from 'react';
import styles from "../page.module.css";
import { useRouter } from "next/navigation";  
import { QrCode, Upload, CheckCircle, XCircle } from 'lucide-react';
import Qrcode from '@/components/shared/qrcode';
import Parcourir from '@/components/shared/parcourir';

const buildLabel = () => {
  
    const [compareOnlineReady, setcompareOnlineReady] = useState(false)
    const [hashRecorded, setHashRecorded] = useState("");
  
    const router = useRouter();
  
    const verifyQrCode = (code: string) => {
      if(code !== "" && code !== null && code !== undefined) {
        console.log("SALUT C COOL", code)
        setcompareOnlineReady(true);
        setHashRecorded(code);
      } else { setcompareOnlineReady(false) }
    }
    const cancelHash = () => {
    setcompareOnlineReady(false);
    setHashRecorded("")
  }

  const approuveHash = () => {
    console.log('on envoi :', hashRecorded)
    router.push(`/nftcheck?message=${hashRecorded}`);
  }

  return (
    <div className={`verifier-container ${styles.page}`}>
      <div className="verifier-content">
        <h1 className="verifier-title">Authentifier un objet</h1>
        <p className="verifier-subtitle">Choisissez une méthode de vérification</p>

        <div className="verifier-methods">
          <div className="verify-method-card">
            <div className="method-header">
              <Upload size={40} />
              <h2>Uploader la photo de l'objet</h2>
            </div>
            <div className="method-body">
              <Parcourir recordHashQr={verifyQrCode}/>
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
                <button className="btn-confirm" onClick={approuveHash}>
                  <CheckCircle size={20} />
                  Vérifier
                </button>
                <button className="btn-cancel" onClick={cancelHash}>
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

export default buildLabel