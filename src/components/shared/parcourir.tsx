import React from 'react'
import {BadgeCheck} from 'lucide-react';
import {useEffect, useState} from 'react'

interface QrcodeProps {
  recordHashQr: (data: string) => void;
}

const Parcourir = ({ recordHashQr }: QrcodeProps) => {

    const [fileHash, setFileHash] = useState<string | null>(null);
    
         const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
    
        // Lire le fichier comme ArrayBuffer
        const buffer = await file.arrayBuffer();
    
        // Calculer le hash SHA-256
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
        setFileHash(hashHex);
        console.log('CA PASSE')
        recordHashQr(hashHex);
      };
  return (
    <div>
                    <div className="choix-titre">DEFINIR UN FICHIER A VERIFIER</div>
                    <BadgeCheck size={200} />
                    <div>
                      <input type="file" onChange={handleFileChange} />
                      {fileHash && (
                        <div>
                          <p>Hash SHA-256 du fichier :</p>
                          <code>{fileHash}</code>
                        </div>
                      )}
                    </div>
                </div>
  )
}

export default Parcourir