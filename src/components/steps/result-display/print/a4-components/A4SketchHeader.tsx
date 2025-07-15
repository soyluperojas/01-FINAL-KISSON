
interface A4SketchHeaderProps {
  title: string;
  description: string;
}

export const A4SketchHeader = ({ title, description }: A4SketchHeaderProps) => {
  return (
    <>
      {/* Header Section - More compact */}
      <div style={{
        textAlign: 'center',
        marginBottom: '8mm',
        borderBottom: '1px solid #ccc',
        paddingBottom: '6mm'
      }}>
        <h1 style={{
          fontSize: '18pt',
          fontWeight: 'bold',
          margin: '0',
          color: '#333',
          lineHeight: '1.2'
        }}>
          {title}
        </h1>
      </div>

      {/* Poetic Description - More compact */}
      <div style={{
        textAlign: 'center',
        marginBottom: '8mm',
        fontStyle: 'italic',
        fontSize: '10pt',
        color: '#666',
        lineHeight: '1.3'
      }}>
        {description || "A recipe that captures the essence of memories, transforming emotions into culinary art."}
      </div>
    </>
  );
};
