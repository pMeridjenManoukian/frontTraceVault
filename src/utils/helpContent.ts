// Contenu d'aide localisé pour chaque page de l'application

export interface HelpContent {
  title: string;
  sections: {
    subtitle?: string;
    content: string;
  }[];
}

export const helpContentMap: Record<string, HelpContent> = {
  // Page d'accueil
  '/': {
    title: 'Bienvenue sur TraceVault',
    sections: [
      {
        subtitle: 'Qu\'est-ce que TraceVault ?',
        content: 'TraceVault est une plateforme de traçabilité basée sur la blockchain qui vous permet de créer et gérer des NFT pour authentifier vos produits et documents.'
      },
      {
        subtitle: 'Comment commencer ?',
        content: 'Connectez votre wallet en utilisant le bouton "Connect Wallet" en haut à droite, puis explorez les différentes fonctionnalités disponibles.'
      }
    ]
  },

  // Page liste des NFT
  '/listenft': {
    title: 'Vos NFT',
    sections: [
      {
        subtitle: 'Gestion de vos NFT',
        content: 'Cette page affiche tous les NFT associés à votre wallet. Vous pouvez visualiser, rechercher et gérer vos certificats d\'authenticité numériques.'
      },
      {
        subtitle: 'Actions disponibles',
        content: 'Cliquez sur un NFT pour voir ses détails complets, y compris l\'historique des versions et les documents associés.'
      }
    ]
  },

  // Page de vérification
  '/nftcheck': {
    title: 'Consulter le certificat d\'authenticité',
    sections: [
      {
        subtitle: 'Une étiquette produit déjà authentifiée par Tracevault ?',
        content: 'Consultez son image, sa date d\'authentification et le nom de l\'objet authentifié'
      },
      {
        subtitle: 'Informations affichées',
        content: 'La vérification vous montrera toutes les informations du NFT, son historique, et confirmera son authenticité Tracevault sur la blockchain.'
      }
    ]
  },

  // Page de vérification générale
  '/verifier': {
    title: 'Vérification d\'authenticité',
    sections: [
      {
        subtitle: 'Scanner un QR code',
        content: 'Utilisez votre caméra pour scanner le QR code présent sur le produit. Assurez-vous d\'avoir autorisé l\'accès à la caméra.'
      },
      {
        subtitle: 'Saisie manuelle',
        content: 'Vous pouvez également téléverser le fichier à vérifier'
      }
    ]
  },

  // Page choix
  '/choix': {
    title: 'Choisir une action',
    sections: [
      {
        content: 'Sélectionnez l\'action que vous souhaitez effectuer : créer un nouveau NFT, vérifier un NFT existant, ou gérer vos NFT.'
      }
    ]
  },

  // Page authentifier
  '/authentifier': {
    title: 'Authentification',
    sections: [
      {
        subtitle: 'Scanner pour authentifier',
        content: 'Scannez le QR code du produit pour accéder à ses informations d\'authentification et vérifier sa provenance.'
      },
      {
        subtitle: 'Sécurité',
        content: 'Toutes les données d\'authentification sont stockées de manière sécurisée sur la blockchain et ne peuvent pas être falsifiées.'
      }
    ]
  },

  // Page authentifier choix
  '/authentifierchoix': {
    title: 'Options d\'authentification',
    sections: [
      {
        content: 'Choisissez la méthode d\'authentification : scanner un QR code ou saisir manuellement les informations du produit.'
      }
    ]
  },

  // Page build version
  '/buildVersion': {
    title: 'Créer une nouvelle version',
    sections: [
      {
        subtitle: 'Versionnage de NFT',
        content: 'Créez une nouvelle version de votre NFT pour suivre les modifications et mises à jour de votre produit dans le temps.'
      },
      {
        subtitle: 'Informations requises',
        content: 'Remplissez tous les champs obligatoires et ajoutez une description claire des changements apportés dans cette version.'
      }
    ]
  },

  // Page build document
  '/buildDocument': {
    title: 'Ajouter un document',
    sections: [
      {
        subtitle: 'Documents attachés',
        content: 'Ajoutez des documents supplémentaires à votre NFT : certificats, factures, garanties, ou tout autre document pertinent.'
      },
      {
        subtitle: 'Format des fichiers',
        content: 'Les documents sont stockés sur IPFS pour garantir leur pérennité et immuabilité. Formats acceptés : PDF, images, documents texte.'
      }
    ]
  },

  // Page build label
  '/buildLabel': {
    title: 'Créer une étiquette',
    sections: [
      {
        subtitle: 'Génération d\'étiquette',
        content: 'Créez une étiquette physique avec QR code pour votre produit. Cette étiquette permettra la vérification rapide de l\'authenticité.'
      },
      {
        subtitle: 'Impression',
        content: 'Une fois générée, vous pourrez télécharger et imprimer l\'étiquette pour l\'apposer sur votre produit.'
      }
    ]
  }
};

// Fonction helper pour récupérer le contenu d'aide selon le pathname
export function getHelpContent(pathname: string): HelpContent {
  return helpContentMap[pathname] || {
    title: 'Aide',
    sections: [
      {
        content: 'Page d\'aide non disponible pour cette section. Veuillez consulter la documentation générale ou contacter le support.'
      }
    ]
  };
}
