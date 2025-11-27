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
    <div style={{ textAlign: 'center' }}>
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          ❌ {error}
        </div>
      )}
      
      {isScanning && !error && (
        <div style={{ color: 'green', marginBottom: '10px' }}>
          📷 Scanner actif...
        </div>
      )}

      <video
        ref={videoRef}
        style={{ 
          width: '100%', 
          maxWidth: '500px',
          border: '2px solid #ccc',
          borderRadius: '8px'
        }}
        autoPlay
        playsInline
        muted
      />
      
      {result && (
        <div style={{ marginTop: '20px' }}>
          <p style={{ fontWeight: 'bold' }}>✅ QR Code détecté :</p>
          <code style={{ 
            background: '#f4f4f4', 
            padding: '10px', 
            borderRadius: '4px',
            display: 'block',
            wordBreak: 'break-all'
          }}>
            {result}
          </code>
        </div>
      )}
    </div>
  );
};

export default Qrcode;
