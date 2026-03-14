import React, { useEffect, useState } from 'react';

interface LoadingBarProps {
  isLoading: boolean;
}

const LoadingBar: React.FC<LoadingBarProps> = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let hideTimeout: ReturnType<typeof setTimeout>;

    if (isLoading) {
      // Use an asynchronous call to trigger the animation start to avoid cascading renders
      const startAnimation = requestAnimationFrame(() => {
        setVisible(true);
        setProgress(10);
      });

      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90;
          return prev + Math.random() * 10;
        });
      }, 400);

      return () => {
        cancelAnimationFrame(startAnimation);
        clearInterval(interval);
      };
    } else {
      // When loading stops, jump to 100% then hide after a delay
      const finishAnimation = requestAnimationFrame(() => {
        setProgress(100);
      });

      hideTimeout = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 500);

      return () => {
        cancelAnimationFrame(finishAnimation);
        clearTimeout(hideTimeout);
      };
    }
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[1000] h-1 bg-gray-100">
      <div 
        className="h-full bg-brand-blue transition-all duration-500 ease-out shadow-[0_0_10px_rgba(30,92,234,0.5)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default LoadingBar;
