
interface QRCodeSectionProps {
  shareableUrl: string;
}

export const QRCodeSection = ({ shareableUrl }: QRCodeSectionProps) => {
  if (!shareableUrl) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center" 
         style={{ 
           background: 'white',
           backgroundColor: 'white'
         }}>
      <img 
        src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent(shareableUrl)}`}
        alt="QR Code"
        className="mb-1"
        style={{ 
          width: '60px',
          height: '60px',
          display: 'block',
          background: 'white'
        }}
        onError={(e) => {
          const fallbackUrl = `https://chart.googleapis.com/chart?chs=60x60&cht=qr&chl=${encodeURIComponent(shareableUrl)}`;
          (e.target as HTMLImageElement).src = fallbackUrl;
        }}
      />
      <p style={{ 
         fontSize: '3pt', 
         margin: '0',
         color: 'black',
         lineHeight: '1.0',
         background: 'white',
         textAlign: 'center'
       }}>
        Scan
      </p>
    </div>
  );
};
