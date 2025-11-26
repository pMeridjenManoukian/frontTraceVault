import React from 'react'
import styles from "../page.module.css";
import logo from '@/assets/tracevaultlogo.png';
import Link from 'next/link';
import {Download, BadgeCheck, ClipboardPlus} from 'lucide-react';

const choix = () => {
  return (
    <div className={`choix-container ${styles.page}`}>
            <div className="choix-verifier choix-produits">
                <Link href="/verifier">
                    <div className="choix-titre">VERIFIER UN ELEMENT</div>
                    <BadgeCheck size={200} />
                </Link>
            </div>
            <div className="choix-authentifier choix-produits">
                <Link href="/authentifier">
                    <div className="choix-titre">CREER UNE AUTHENTIFICATION DE DOCUMENT OU VERSION</div>
                    <ClipboardPlus size={200} />
                </Link>
            </div>
    </div>    
  )
}

export default choix