import { Suspense } from 'react';
import NftCheckContent from '@/components/shared/NftCheckContent';

export default function NftCheckPage() {
  return (
    <Suspense fallback={
      <div className="nftcheck">
        <div className="NFT-titre">⏳ Chargement...</div>
      </div>
    }>
      <NftCheckContent />
    </Suspense>
  );
}
