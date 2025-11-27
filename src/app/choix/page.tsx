import styles from "../page.module.css";
import Link from 'next/link';
import { BadgeCheck, ClipboardPlus } from 'lucide-react';

export default function Choix() {
  return (
    <div className={`choix-container ${styles.page}`}>
      <div className="choix-content">
        <h1 className="choix-main-title">Que souhaitez-vous faire ?</h1>

        <div className="choix-cards">
          <Link href="/verifier" className="choix-card choix-verifier">
            <div className="choix-card-icon">
              <BadgeCheck size={80} />
            </div>
            <h2 className="choix-card-title">Vérifier un document</h2>
            <p className="choix-card-description">
              Vérifiez l'authenticité d'un document en scannant son QR code ou en uploadant le fichier
            </p>
            <div className="choix-card-action">
              Commencer la vérification →
            </div>
          </Link>

          <Link href="/authentifier" className="choix-card choix-authentifier">
            <div className="choix-card-icon">
              <ClipboardPlus size={80} />
            </div>
            <h2 className="choix-card-title">Authentifier un document</h2>
            <p className="choix-card-description">
              Créez une authentification blockchain pour votre document ou version
            </p>
            <div className="choix-card-action">
              Créer une authentification →
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}