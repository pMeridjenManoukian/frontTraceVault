/**
 * Utilitaires pour IPFS
 */

// Gateway IPFS public recommandé
export const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';

// Gateways alternatifs (en cas de problème)
export const IPFS_GATEWAYS = {
  PUBLIC: 'https://ipfs.io/ipfs/',
  PINATA: 'https://gateway.pinata.cloud/ipfs/',
  CLOUDFLARE: 'https://cloudflare-ipfs.com/ipfs/',
  INFURA: 'https://infura-ipfs.io/ipfs/',
};

/**
 * Convertit un hash ou URI IPFS en URL complète
 * @param ipfsHashOrUri - Hash IPFS (QmXxx...) ou URI (ipfs://QmXxx...)
 * @param gateway - Gateway IPFS à utiliser (par défaut: ipfs.io)
 * @returns URL complète vers le fichier
 */
export function getIpfsUrl(ipfsHashOrUri: string, gateway: string = IPFS_GATEWAY): string {
  if (!ipfsHashOrUri) return '';

  // Si c'est déjà une URL HTTP, la retourner telle quelle
  if (ipfsHashOrUri.startsWith('http://') || ipfsHashOrUri.startsWith('https://')) {
    return ipfsHashOrUri;
  }

  // Enlever le préfixe ipfs:// si présent
  const hash = ipfsHashOrUri.replace('ipfs://', '');

  // Retourner l'URL complète
  return `${gateway}${hash}`;
}

/**
 * Extrait le hash IPFS d'une URL ou URI
 * @param ipfsUrl - URL ou URI IPFS
 * @returns Hash IPFS pur (sans préfixe)
 */
export function extractIpfsHash(ipfsUrl: string): string {
  if (!ipfsUrl) return '';

  // Si c'est un URI ipfs://
  if (ipfsUrl.startsWith('ipfs://')) {
    return ipfsUrl.replace('ipfs://', '');
  }

  // Si c'est une URL avec gateway
  const match = ipfsUrl.match(/\/ipfs\/([a-zA-Z0-9]+)/);
  if (match && match[1]) {
    return match[1];
  }

  // Sinon, retourner tel quel (probablement déjà un hash)
  return ipfsUrl;
}

/**
 * Interface pour les métadonnées NFT standard ERC721
 */
export interface NftMetadata {
  name?: string;
  description?: string;
  image?: string;
  external_url?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  [key: string]: any;
}

/**
 * Récupère les métadonnées JSON d'un NFT depuis IPFS
 * @param metadataUri - URI ou hash IPFS du fichier metadata.json
 * @param gateway - Gateway IPFS à utiliser
 * @returns Métadonnées du NFT
 */
export async function fetchNftMetadata(
  metadataUri: string,
  gateway: string = IPFS_GATEWAY
): Promise<NftMetadata | null> {
  try {
    const url = getIpfsUrl(metadataUri, gateway);
    console.log('🔍 Récupération metadata depuis:', url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const metadata: NftMetadata = await response.json();
    console.log('📋 Metadata récupéré:', metadata);

    return metadata;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du metadata:', error);
    return null;
  }
}

/**
 * Extrait l'URL de l'image depuis les métadonnées NFT
 * @param metadata - Métadonnées du NFT
 * @returns Hash IPFS de l'image ou URL complète
 */
export function getImageFromMetadata(metadata: NftMetadata | null): string {
  if (!metadata || !metadata.image) return '';

  // Extraire le hash IPFS depuis le champ image
  return extractIpfsHash(metadata.image);
}
