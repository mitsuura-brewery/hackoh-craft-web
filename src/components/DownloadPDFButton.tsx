'use client';

import { Material } from '@/types/material';
import { pdf } from '@react-pdf/renderer';
import { Download } from 'lucide-react';
import { MaterialRecipePDF, generateQRCode } from './MaterialRecipePDF';
import { calculateMaterialSpecs, generateShopifyUrl } from '@/utils/material';
import { getSimilarMisoInfo } from '@/utils/miso';
import { motion } from 'motion/react';
import { useState } from 'react';

interface DownloadPDFButtonProps {
  selectedMaterials: Material[];
  selectedMonth: number;
  selectedRegion: string;
  disabled?: boolean;
}

export default function DownloadPDFButton({
  selectedMaterials,
  selectedMonth,
  selectedRegion,
  disabled = false,
}: DownloadPDFButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (disabled || selectedMaterials.length === 0 || isGenerating) return;

    try {
      setIsGenerating(true);

      const specs = calculateMaterialSpecs(selectedMaterials, selectedMonth, selectedRegion);
      const misoInfo = getSimilarMisoInfo(selectedMaterials, specs);

      // 組み合わせ番号（現在は固定）
      const combiNumber = '123-456';

      // ShopifyURLを生成
      const shopifyUrl = generateShopifyUrl(
        selectedMaterials,
        'https://hackoh.jp',
        combiNumber,
      );

      // シミュレーションURLを生成
      const simulationUrl = `https://mitsuura-brewery.github.io/hackoh-craft-web/?combi-number=${combiNumber}`;

      // QRコードを生成
      const simulationQRCode = await generateQRCode(simulationUrl);
      const purchaseQRCode = await generateQRCode(shopifyUrl);

      // PDFドキュメントを生成
      const blob = await pdf(
        <MaterialRecipePDF
          materials={selectedMaterials}
          specs={specs}
          misoInfo={misoInfo}
          month={selectedMonth}
          region={selectedRegion}
          shopifyUrl={shopifyUrl}
          combiNumber={combiNumber}
          simulationQRCode={simulationQRCode}
          purchaseQRCode={purchaseQRCode}
        />,
      ).toBlob();

      // ダウンロード
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `味噌材料レシピ_${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF生成エラー:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.button
      onClick={handleDownload}
      disabled={disabled || isGenerating}
      whileHover={{ scale: disabled || isGenerating ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isGenerating ? 1 : 0.98 }}
      className="w-full py-3 px-6 rounded-2xl bg-ferment-secondary/10 hover:bg-ferment-secondary/20 border-2 border-ferment-secondary text-ferment-dark font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="flex items-center justify-center gap-2">
        <Download size={20} className={isGenerating ? 'animate-bounce' : ''} />
        <span>{isGenerating ? 'PDF生成中...' : 'この組み合わせのPDFを取得する'}</span>
      </div>
    </motion.button>
  );
}
