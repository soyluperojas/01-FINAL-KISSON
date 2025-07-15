
interface A4SketchFooterProps {
  shareableUrl: string;
}

export const A4SketchFooter = ({ shareableUrl }: A4SketchFooterProps) => {
  return (
    <div style={{
      position: 'absolute',
      bottom: '8mm',
      left: '12mm',
      right: '12mm',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: '1px solid #eee',
      paddingTop: '4mm',
      height: '12mm'
    }}>
      {/* Logo */}
      <div style={{
        width: '12mm',
        height: '12mm'
      }}>
        <img 
          src="/lovable-uploads/7d0c86e8-de4d-46a1-ab91-4fb74602093c.png"
          alt="KissOn Logo"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* Center Text */}
      <div style={{
        fontSize: '7pt',
        color: '#666',
        textAlign: 'center'
      }}>
        <strong>KissOn Memory Recipe Generator</strong><br/>
        From Feeling To Filling
      </div>

      {/* QR Code */}
      <div style={{
        width: '12mm',
        height: '12mm'
      }}>
        <img 
          src={`https://api.qrserver.com/v1/create-qr-code/?size=48x48&data=${encodeURIComponent(shareableUrl)}`}
          alt="Recipe QR Code"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
          onError={(e) => {
            const fallbackUrl = `https://chart.googleapis.com/chart?chs=48x48&cht=qr&chl=${encodeURIComponent(shareableUrl)}`;
            (e.target as HTMLImageElement).src = fallbackUrl;
          }}
        />
      </div>
    </div>
  );
};
