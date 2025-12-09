"use client";

import {CircleAlert, ShieldCheck, Hash, Fingerprint, Package} from 'lucide-react';
import Image from "next/image";
import couilles from '@/assets/couilles.jpg';
import { getIpfsUrl } from '@/utils/ipfs';
import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface NftcardProps{
    hashlocal: string;
    isNft: boolean;
    isEtiquette: boolean;
    productName?: string;
    photoUrl?: string;
    tokenId?: string;
    isFromVerification?: boolean;
    versionInfo?: {
        current: string;
        total: string;
        isLast: boolean;
    };
}

// Composant pour afficher le QR code
const QRCodeDisplay = ({ hash }: { hash: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current && hash) {
            QRCode.toCanvas(canvasRef.current, hash, {
                width: 180,
                margin: 1,
                color: {
                    dark: '#1f2937',
                    light: '#FFFFFF'
                }
            }, (error) => {
                if (error) console.error('Erreur génération QR code:', error);
            });
        }
    }, [hash]);

    return (
        <div className="qr-code-container">
            <canvas ref={canvasRef} />
            <p className="qr-code-label">Scannez pour authentifier</p>
        </div>
    );
};

const Nftcard = ({hashlocal, isNft, isEtiquette, productName, photoUrl, tokenId, isFromVerification, versionInfo}: NftcardProps) => {

    // Debug logs
    console.log('🎴 Nftcard - Props reçues:');
    console.log('  - photoUrl:', photoUrl);
    console.log('  - photoUrl transformée:', photoUrl ? getIpfsUrl(photoUrl) : 'undefined');
    console.log('  - productName:', productName);

    // Carte d'échec - pas de NFT trouvé
    if (!isNft) {
        return (
            <div className="auth-card auth-card--invalid">
                <div className="auth-card__header">
                    <CircleAlert size={48} className="auth-card__icon auth-card__icon--error" />
                    <h2 className="auth-card__title">Non Authentifié</h2>
                </div>
                <div className="auth-card__body">
                    <p className="auth-card__message">
                        Cet élément ne correspond à aucun certificat d'authenticité enregistré sur la blockchain.
                    </p>
                </div>
            </div>
        );
    }

    // Carte pour Document/Classeur
    if (isEtiquette) {
        return (
            <div className="auth-card auth-card--document">
                <div className="auth-card__header">
                    <div className="auth-card__badge">
                        <ShieldCheck size={28} />
                        <span>Certifié</span>
                    </div>
                </div>

                <div className="auth-card__body">
                    <div className="auth-card__status">
                        <Package size={64} className="auth-card__icon auth-card__icon--success" />
                        <h2 className="auth-card__title">Document Certifié</h2>
                        <p className="auth-card__subtitle">Classeur / Document</p>
                    </div>

                    {versionInfo && (
                        <div className="auth-card__version">
                            <div className={`version-badge ${versionInfo.isLast ? 'version-badge--current' : 'version-badge--old'}`}>
                                {versionInfo.isLast ? '✓ Dernière version' : '⚠ Version obsolète'}
                            </div>
                            <p className="version-info">
                                Version {versionInfo.current} sur {versionInfo.total}
                            </p>
                        </div>
                    )}

                    <div className="auth-card__qr">
                        <QRCodeDisplay hash={hashlocal} />
                    </div>

                    <div className="auth-card__hash">
                        <Hash size={18} />
                        <div className="hash-content">
                            <span className="hash-label">Empreinte numérique</span>
                            <code className="hash-value">{hashlocal}</code>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Carte pour Label/Étiquette d'objet physique
    return (
        <div className="auth-card auth-card--label">
            <div className="auth-card__header">
                <div className="auth-card__badge">
                    <ShieldCheck size={28} />
                    <span>Authentique</span>
                </div>
            </div>

            <div className="auth-card__body">
                <div className="auth-card__image-section">
                    {photoUrl ? (
                        <img
                            src={getIpfsUrl(photoUrl)}
                            alt={productName || "Produit authentifié"}
                            className="auth-card__image"
                            onError={(e) => {
                                console.error('Erreur chargement image IPFS:', photoUrl);
                                e.currentTarget.src = couilles.src;
                            }}
                        />
                    ) : (
                        <Image
                            src={couilles}
                            width={400}
                            height={400}
                            alt="Produit"
                            className="auth-card__image"
                        />
                    )}
                </div>

                <div className="auth-card__info-section">
                    <div className="auth-card__product">
                        <Fingerprint size={32} className="product-icon" />
                        <div className="product-details">
                            <h3 className="product-label">Certificat d'Authenticité NFT</h3>
                            <h2 className="product-name">{productName || "Produit Certifié"}</h2>
                        </div>
                    </div>

                    {tokenId && (
                        <div className="auth-card__token">
                            <span className="token-label">Token ID</span>
                            <span className="token-value">#{tokenId}</span>
                        </div>
                    )}

                    <div className="auth-card__qr">
                        <QRCodeDisplay hash={hashlocal} />
                    </div>

                    <div className="auth-card__hash">
                        <Hash size={18} />
                        <div className="hash-content">
                            <span className="hash-label">Empreinte numérique</span>
                            <code className="hash-value">{hashlocal}</code>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Nftcard;
