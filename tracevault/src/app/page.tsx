import Image from "next/image";
import styles from "./page.module.css";
import Content from '../components/content';
import logo from '@/assets/tracevaultlogo.png';
import Link from 'next/link';

export default function Home() {
  return (
    <div className={`home-container ${styles.page}`}>
     <Image 
     src={logo}
     width={1024}
     height={1024}
     alt="logo acceuil"
     ></Image>
    <Link className="launchapp" href="/choix">
      <button>lancer application</button>
    </Link>
    </div>
  );
}
