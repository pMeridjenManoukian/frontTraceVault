import Link from 'next/link'
import { Github, Twitter, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">TraceVault</h3>
          <p className="footer-description">
            Solution blockchain pour l'authentification et la vérification de documents
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Navigation</h4>
          <ul className="footer-links">
            <li><Link href="/choix">Application</Link></li>
            <li><Link href="/verifier">Vérifier</Link></li>
            <li><Link href="/authentifier">Authentifier</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Ressources</h4>
          <ul className="footer-links">
            <li><Link href="#">Documentation</Link></li>
            <li><Link href="#">Guide d'utilisation</Link></li>
            <li><Link href="#">FAQ</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Contact</h4>
          <div className="footer-social">
            <a href="#" aria-label="GitHub">
              <Github size={20} />
            </a>
            <a href="#" aria-label="Twitter">
              <Twitter size={20} />
            </a>
            <a href="#" aria-label="Email">
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} TraceVault. Tous droits réservés.</p>
      </div>
    </footer>
  )
}

export default Footer