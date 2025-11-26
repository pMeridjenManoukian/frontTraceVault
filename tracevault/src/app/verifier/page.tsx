"use client";

import {useEffect, useState} from 'react'
import styles from "../page.module.css";
import { useRouter, useParams } from "next/navigation";
import logo from '@/assets/tracevaultlogo.png';
import Link from 'next/link';
import {Download, ClipboardPlus} from 'lucide-react';
import Qrcode from '@/components/shared/qrcode';
import Parcourir from '@/components/shared/parcourir';

const verifier = () => {
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
    <div className={`choix-container ${styles.page}`}>
            <div className="choix-verifier choix-produits">
                <Parcourir recordHashQr={verifyQrCode}/>
            </div>
            <div className="choix-authentifier choix-produits">
                <div>
                    <div className="choix-titre">SCANNER QR CODE</div>
                    <ClipboardPlus size={200} />
                    <Qrcode recordHashQr={verifyQrCode}/>
                </div>
                {compareOnlineReady ?
                <div className="suiteHash">
                  <h3>Voulez vous utiliser le hash{hashRecorded} et vérifier l'authenticité du docuement ? </h3>
                  <div><div className="validerHash button" onClick={approuveHash}>OUI</div><div className="annulerHash button" onClick={cancelHash}>NON</div></div>
                  </div> : ""}
            </div>
    </div>    
  )
}

export default verifier