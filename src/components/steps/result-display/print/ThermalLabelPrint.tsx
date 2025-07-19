import { RecipeData } from "@/components/RecipeWizard";

interface ExtendedRecipeData extends RecipeData {
  generatedTitle?: string;
  generatedRecipe?: string;
  generatedIngredients?: string[];
  generatedDescription?: string;
  storedImageUrl?: string;
}

interface ThermalLabelPrintProps {
  recipeData: ExtendedRecipeData;
  shareableUrl: string;
  recipeTitle: string;
}

export const ThermalLabelPrint = ({ recipeData, shareableUrl, recipeTitle }: ThermalLabelPrintProps) => {
  const displayTitle = recipeTitle || recipeData.generatedTitle || `${recipeData.emotionalIngredients?.[0] || "Memory"} Recipe`;

  return (
    <div 
      id="thermal-print-area"
      className="thermal-label-print"
      style={{
        width: '4in',
        height: '6in',
        backgroundColor: 'white',
        color: 'black',
        fontFamily: "'Courier Prime', 'Courier New', monospace",
        fontSize: '11pt',
        lineHeight: '1.2',
        padding: '0.8in',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center', // ← CENTRADO horizontal
        textAlign: 'center',   // ← CENTRADO texto
        boxSizing: 'border-box'
      }}
    >
      {/* Recipe Title */}
      <div style={{ marginBottom: '0.2in' }}>
        <h1 style={{ 
          fontSize: '18pt', 
          fontWeight: 'bold', 
          margin: 0,
          lineHeight: '1.1',
          wordWrap: 'break-word'
        }}>
          {displayTitle}
        </h1>
      </div>

      {/* QR Code */}
      <div style={{ marginBottom: '0.2in' /* espacio más corto */ }}>
        {shareableUrl && shareableUrl.length < 1800 ? (
        <img 
          src={`https://api.qrserver.com/v1/create-qr-code/?size=138x138&data=${encodeURIComponent(shareableUrl)}`}
          alt="Recipe QR Code"
          style={{ 
            width: '1.38in',
            height: '1.38in',
            display: 'block',
            margin: '0 auto'
          }}
          onError={(e) => {
            const fallbackUrl = `https://chart.googleapis.com/chart?chs=138x138&cht=qr&chl=${encodeURIComponent(shareableUrl)}`;
            (e.target as HTMLImageElement).src = fallbackUrl;
          }}
        />
        ) : (
          <div style={{
            width: '1.38in',
            height: '1.38in',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#eee',
            color: '#333',
            fontSize: '10pt',
            border: '1px solid #ccc',
            borderRadius: '8px',
            margin: '0 auto'
          }}>
            QR not available<br />
            (URL too long)
          </div>
        )}
        <p style={{ 
          fontSize: '8pt', 
          marginTop: '4px', 
          color: '#666',
          wordBreak: 'break-all',
          maxWidth: '1.38in',
          margin: '0 auto',
        }}>
          Scan for full recipe
        </p>
        {/* Mostrar la URL como texto si el QR no se puede generar */}
        {(!shareableUrl || shareableUrl.length >= 1800) && (
          <div style={{ fontSize: '7pt', color: '#999', marginTop: 8, wordBreak: 'break-all', maxWidth: '1.38in', margin: '0 auto' }}>
            {shareableUrl}
          </div>
        )}
      </div>

      {/* Description */}
      <div style={{ fontSize: '9pt', lineHeight: '1.1', textAlign: 'left', width: '100%' }}>
        <p style={{ margin: 0 }}>
          A memory recipe inspired by {recipeData.memoryType} moments
        </p>
        {recipeData.emotionalIngredients?.length > 0 && (
          <p style={{ margin: '4px 0 0 0', fontStyle: 'italic' }}>
            Infused with: {recipeData.emotionalIngredients.slice(0, 2).join(", ")}
          </p>
        )}
      </div>

      {/* Logo */}
      <div style={{ marginTop: '0.2in' }}>
        <img 
          src="/lovable-uploads/7d0c86e8-de4d-46a1-ab91-4fb74602093c.png"
          alt="KissOn Logo"
          style={{ 
            width: '1in',
            height: '0.9in',
            objectFit: 'contain'
          }}
        />
      </div>
    </div>
  );
};
