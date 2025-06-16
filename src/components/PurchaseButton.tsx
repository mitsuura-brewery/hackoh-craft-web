'use client';

import { Material } from '@/types/fermentation';
import { generateShopifyUrl } from '@/utils/fermentation';
import { motion } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { ShoppingCart, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface PurchaseButtonProps {
  selectedMaterials: Material[];
  disabled?: boolean;
  shopifyBaseUrl?: string;
}

export default function PurchaseButton({ 
  selectedMaterials, 
  disabled = false,
  shopifyBaseUrl = 'https://your-miso-shop.myshopify.com'
}: PurchaseButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const buttonSpring = useSpring({
    scale: disabled ? 0.95 : (isClicked ? 0.98 : (isHovered ? 1.05 : 1)),
    opacity: disabled ? 0.5 : 1,
    background: disabled 
      ? 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)'
      : isHovered
        ? 'linear-gradient(135deg, #A0522D 0%, #CD853F 100%)'
        : 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
    boxShadow: disabled
      ? '0 4px 15px rgba(139, 69, 19, 0.2)'
      : isHovered
        ? '0 12px 30px rgba(139, 69, 19, 0.4)'
        : '0 8px 20px rgba(139, 69, 19, 0.3)',
    config: { tension: 300, friction: 10 }
  });

  const iconSpring = useSpring({
    transform: isHovered ? 'translateX(5px)' : 'translateX(0px)',
    config: { tension: 300, friction: 10 }
  });

  const handleClick = () => {
    if (disabled || selectedMaterials.length === 0) return;

    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 150);

    // Shopify URLを生成して遷移
    const shopifyUrl = generateShopifyUrl(selectedMaterials, shopifyBaseUrl);
    
    // 新しいタブで開く
    window.open(shopifyUrl, '_blank', 'noopener,noreferrer');

    // アナリティクス（必要に応じて）
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'purchase_intent', {
        event_category: 'ecommerce',
        event_label: selectedMaterials.map(m => m.name).join(', '),
        value: selectedMaterials.length
      });
    }
  };

  const materialNames = selectedMaterials.map(m => m.name).join('、');
  
  return (
    <div className="space-y-4">
      {/* 選択した材料の確認 */}
      {selectedMaterials.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-ferment-light/30 rounded-2xl p-4 border border-ferment-primary/20"
        >
          <h3 className="font-semibold text-ferment-primary mb-2">
            選択中の材料
          </h3>
          <p className="text-sm text-ferment-dark leading-relaxed">
            {materialNames}
          </p>
        </motion.div>
      )}

      {/* 購入ボタン */}
      <animated.button
        style={buttonSpring}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={disabled}
        className="w-full py-4 px-6 rounded-2xl text-white font-bold text-lg border-0 cursor-pointer relative overflow-hidden disabled:cursor-not-allowed transition-all duration-200"
      >
        <div className="flex items-center justify-center gap-3 relative z-10">
          <ShoppingCart size={24} />
          <span>
            {selectedMaterials.length === 0 
              ? '材料を選択してください' 
              : 'ECサイトで購入する'
            }
          </span>
          <animated.div style={iconSpring}>
            <ExternalLink size={20} />
          </animated.div>
        </div>

        {/* ホバー時のエフェクト */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: isHovered ? '100%' : '-100%' }}
          transition={{ duration: 0.6 }}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
        />
      </animated.button>

      {/* 説明テキスト */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <p className="text-xs text-ferment-secondary/70 leading-relaxed">
          選択した材料の組み合わせがカートに追加され、<br />
          ECサイトで決済を進めることができます
        </p>
      </motion.div>

      {/* 注意事項（必要に応じて） */}
      {selectedMaterials.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-xs text-ferment-secondary/60 bg-ferment-accent/5 rounded-xl p-3 border border-ferment-accent/20"
        >
          <p className="mb-1">📋 ご注意</p>
          <ul className="space-y-1 ml-4">
            <li>• 発酵期間は季節や環境により変動する場合があります</li>
            <li>• 初回製造時は説明書をよくお読みください</li>
            <li>• 保存方法により品質が左右されます</li>
          </ul>
        </motion.div>
      )}
    </div>
  );
}