import React from 'react'
import {BadgeCheck} from 'lucide-react';
import {useState, useRef, useImperativeHandle, forwardRef} from 'react'

interface QrcodeProps {
  recordHashQr: (data: string) => void;
  label?: boolean;
  setFileFromParcourir?: (file: File) => void;
}

export interface ParcourirRef {
  triggerFileInput: () => void;
}

const Parcourir = forwardRef<ParcourirRef, QrcodeProps>(({ recordHashQr, label = false, setFileFromParcourir }, ref) => {

    const [fileHash, setFileHash] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      triggerFileInput: () => {
        fileInputRef.current?.click();
      }
    }));

         const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Si label est true, vérifier que c'est une image
        if (label && !['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
          setErrorMessage('⚠️ Veuillez sélectionner une image au format .jpg ou .png');
          setFileHash(null);
          e.target.value = ''; // Réinitialiser l'input
          setTimeout(() => setErrorMessage(null), 5000); // Effacer le message après 5s
          return;
        }

        setErrorMessage(null);

        // Lire le fichier comme ArrayBuffer
        const buffer = await file.arrayBuffer();

        // Calculer le hash SHA-256
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        setFileHash(hashHex);
        recordHashQr(hashHex);

        // Envoyer le fichier au parent si la fonction est définie
        if (setFileFromParcourir) {
          setFileFromParcourir(file);
        }
      };
  return (
    <div>
                    <div className="choix-titre">DEFINIR UN FICHIER A VERIFIER</div>
                    <BadgeCheck size={200} />
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        accept={label ? ".jpg,.jpeg,.png" : undefined}
                      />
                      {errorMessage && (
                        <div className="error-message">
                          {errorMessage}
                        </div>
                      )}
                      {fileHash && (
                        <div>
                          <p>Hash SHA-256 du fichier :</p>
                          <code>{fileHash}</code>
                        </div>
                      )}
                    </div>
                </div>
  )
});

Parcourir.displayName = 'Parcourir';

export default Parcourir