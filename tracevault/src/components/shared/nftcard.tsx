import { hash } from 'crypto'
import React from 'react'
import {CircleAlert, ShieldCheck} from 'lucide-react';
import Image from "next/image";
import couilles from '@/assets/couilles.jpg';

interface NftcardProps{
    hashlocal: string;
    isNft: boolean;
    isEtiquette: boolean;
}

const nonft = (
    <div className='no-nft-card card etiquette'>
                <div className="icon">
                    <CircleAlert size={200} />
                </div>
                <div>
                    Cet element ne correspond à aucun document
                </div>
            </div>
)

const etiquettenft = (
    <div className='yes-nft-card card document'>
                <div className="icon">
                    <ShieldCheck size={200} />
                </div>
                <div>
                    <b>Appartient au document:</b>
                    <div className="titre-nft">Facture C4 Garage Michou</div>
                </div>
                <div>
                    <b>Cette version n'est pas la dernière : </b>
                    <div className="date-nft">version 2 sur 7</div>
                </div>
                <div>
                    <b>certifié le</b>
                    <div className="date-nft">16/12/25</div>
                </div>
            </div>
)

const documentnft = (
    <div className='yes-nft-card card etiquette'>
                <div className="icon">
                    <ShieldCheck size={200} />
                </div>
                <div>
                    <b>Il s'agit du certificat NFT de l'objet :</b>
                    <div className="titre-nft">Mes couilles sur la commode en léton</div>
                </div>
                <div>
                    <b>certifié le</b>
                    <div className="date-nft">16/12/25</div>
                </div>
                <Image 
                    src={couilles}
                    width={1024}
                    height={1024}
                    ></Image>
            </div>
)
const Nftcard
 = ({hashlocal, isNft, isEtiquette}: NftcardProps) => {

    if(isNft) {
        if(isEtiquette) {
        return(
            <div>
                {etiquettenft}
            </div>
        )
        } else {
            return (
                <div>
                    {documentnft}
                </div>
            )
        }
    } else {

    return (
        <div>            
            {nonft}
        </div>
    )
    }
 }
export default Nftcard;
