"use client";

import { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader } from '@zxing/library';

interface QrcodeProps {
  recordHashQr: (data: string) => void;
}

const Qrcode = ({ recordHashQr }: QrcodeProps) => {
  const [result, setResult] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (result !== "") {
      recordHashQr(result);
    }
  }, [result, recordHashQr]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const codeReader = new BrowserQRCodeReader();
    let isMounted = true;

    const initScanner = async () => {
      try {
        if (videoRef.current) {
          // Utilise decodeFromConstraints pour une meilleure gestion des erreurs
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' } // Utilise la caméra arrière par défaut
          });

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }

          codeReader.decodeFromVideoDevice(
            undefined,
            videoRef.current!,
            (result, error) => {
              if (result && isMounted) {
                setResult(result.getText());
              }
              if (error && isMounted) {
                // Ignore les erreurs "NotFoundException" pour éviter les boucles
                if (error.message !== 'No QR code found') {
                  console.error("Erreur du scanner :", error);
                }
              }
            }
          );
        }
      } catch (error) {
        console.error("Erreur d'initialisation du scanner :", error);
      }
    };

    initScanner();

    return () => {
      isMounted = false;
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      codeReader.reset();
    };
  }, []);

  return (
    <div>
      <video
        ref={videoRef}
        style={{ width: '100%', maxWidth: '500px' }}
        autoPlay
        playsInline
        muted
      />
      {result && (
        <div>
          <p>Contenu du QR code :</p>
          <code>{result}</code>
        </div>
      )}
    </div>
  );
};

export default Qrcode;
