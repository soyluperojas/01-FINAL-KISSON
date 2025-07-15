
interface RecipeFooterSectionProps {
  qrCodeValue: string;
}

export const RecipeFooterSection = ({ qrCodeValue }: RecipeFooterSectionProps) => {
  return (
    <>
      {/* Footer Section - QR Code */}
      <div className="text-center border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-600 mb-3">Share this recipe</p>
        <div className="flex justify-center items-center space-x-4">
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(qrCodeValue)}`}
            alt="QR Code to share recipe"
            className="w-16 h-16"
            onError={(e) => {
              const fallbackUrl = `https://chart.googleapis.com/chart?chs=100x100&cht=qr&chl=${encodeURIComponent(qrCodeValue)}`;
              (e.target as HTMLImageElement).src = fallbackUrl;
            }}
          />
          <div className="text-left">
            <p className="text-xs text-gray-500">Scan to view online</p>
            <p className="text-xs text-gray-400 font-mono break-all max-w-48">
              {qrCodeValue.length > 50 ? `${qrCodeValue.substring(0, 50)}...` : qrCodeValue}
            </p>
          </div>
        </div>
      </div>
      
      {/* Logo - Bottom Right Corner */}
      <div className="flex justify-end">
        <img 
          src="/lovable-uploads/7d0c86e8-de4d-46a1-ab91-4fb74602093c.png"
          alt="KissOn Logo"
          className="w-12 h-12 object-contain opacity-60"
        />
      </div>
    </>
  );
};
