import { useEffect, useRef, useState } from 'react';

interface AnimatedNumberProps {
  value: number | string;
  className?: string;
  suffix?: string;
  duration?: number;
}

export default function AnimatedNumber({ 
  value, 
  className = '', 
  suffix = '',
  duration = 800 
}: AnimatedNumberProps) {
  const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
  const [displayValue, setDisplayValue] = useState<number>(numericValue);
  const prevValue = useRef<number>(numericValue);
  const animationRef = useRef<number>();

  useEffect(() => {
    const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    
    if (numericValue !== prevValue.current) {
      const startValue = prevValue.current;
      const endValue = numericValue;
      const difference = Math.abs(endValue - startValue);
      
      // 差分が20より大きい場合は20フレームに制限
      const maxFrames = 20;
      const totalFrames = difference > 20 ? maxFrames : Math.max(1, Math.ceil(difference));
      const stepSize = (endValue - startValue) / totalFrames;
      
      let currentFrame = 0;
      const frameInterval = duration / totalFrames;
      
      const animate = () => {
        currentFrame++;
        // const progress = currentFrame / totalFrames;
        const currentValue = startValue + (stepSize * currentFrame);
        
        // 整数部分のみ表示（小数点以下は表示しない）
        setDisplayValue(Math.round(currentValue));
        
        if (currentFrame < totalFrames) {
          animationRef.current = window.setTimeout(animate, frameInterval);
        } else {
          setDisplayValue(Math.round(endValue));
        }
      };
      
      // 前のアニメーションをクリア
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
      
      animate();
      prevValue.current = numericValue;
    }
  }, [value, duration]);

  // コンポーネントのアンマウント時にアニメーションをクリア
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  if (typeof value === 'string' && isNaN(parseFloat(value))) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span className={className}>
      {displayValue}
      {suffix}
    </span>
  );
}