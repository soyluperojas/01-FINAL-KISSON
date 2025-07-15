
import { WrappingContentLayout } from "./components/WrappingContentLayout";

interface WrappingRecipeContentProps {
  content: string;
  qrWidth: number;
  qrHeight: number;
  logoWidth: number;
  logoHeight: number;
}

export const WrappingRecipeContent = ({
  content,
  qrWidth,
  qrHeight,
  logoWidth,
  logoHeight
}: WrappingRecipeContentProps) => {
  const { containerRef, wrappedContent } = WrappingContentLayout({
    content,
    qrWidth,
    qrHeight,
    logoWidth,
    logoHeight
  });

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative bg-white"
      style={{ background: 'white', color: 'black' }}
    >
      {wrappedContent}
    </div>
  );
};
