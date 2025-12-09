"use client";

import { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader } from '@zxing/library';

interface QrcodeProps {
  recordHashQr: (data: string) => void;
}

const Qrcode = ({ recordHashQr }: QrcodeProps) => {
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserQRCodeReader | null>(null);

  useEffect(() => {
    if (result !== "") {
      recordHashQr(result);
    }
  }, [result, recordHashQr]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isMounted = true;
    const codeReader = new BrowserQRCodeReader();
    codeReaderRef.current = codeReader;

    const initScanner = async () => {
      try {
        setIsScanning(true);
        
        // Liste des caméras disponibles
        const videoInputDevices = await codeReader.listVideoInputDevices();
        
        if (videoInputDevices.length === 0) {
          throw new Error("Aucune caméra détectée");
        }

        // Utilise la première caméra disponible
        const selectedDeviceId = videoInputDevices[0].deviceId;

        if (videoRef.current) {
          await codeReader.decodeFromVideoDevice(
            selectedDeviceId, // ✅ ou null pour la caméra par défaut
            videoRef.current,
            (result, err) => {
              if (result && isMounted) {
                setResult(result.getText());
                setError('');
              }
              if (err && isMounted && err.name !== 'NotFoundException') {
                console.error("Erreur du scanner :", err);
              }
            }
          );
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
        console.error("Erreur d'initialisation :", errorMessage);
        setError(errorMessage);
        setIsScanning(false);
      }
    };

    initScanner();

    return () => {
      isMounted = false;
      setIsScanning(false);
      
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
      
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="qr-scanner">
      {error && (
        <div className="qr-scanner__status qr-scanner__status--error">
          ❌ {error}
        </div>
      )}

      {isScanning && !error && (
        <div className="qr-scanner__status qr-scanner__status--active">
          📷 Scanner actif...
        </div>
      )}

      <video
        ref={videoRef}
        className="qr-scanner__video"
        autoPlay
        playsInline
        muted
      />

      {result && (
        <div className="qr-scanner__result">
          <p className="qr-scanner__result-label">✅ QR Code détecté :</p>
          <code className="qr-scanner__result-code">
            {result}
          </code>
        </div>
      )}
    </div>
  );
};

export default Qrcode;
