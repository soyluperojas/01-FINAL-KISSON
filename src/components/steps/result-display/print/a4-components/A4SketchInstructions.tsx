
interface A4SketchInstructionsProps {
  instructions: string;
}

export const A4SketchInstructions = ({ instructions }: A4SketchInstructionsProps) => {
  return (
    <div style={{
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '0'
    }}>
      <h2 style={{
        fontSize: '12pt',
        fontWeight: 'bold',
        margin: '0 0 4mm 0',
        color: '#333'
      }}>
        Instructions
      </h2>
      
      <div style={{
        fontSize: '8pt',
        lineHeight: '1.3',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        color: '#444',
        overflow: 'hidden',
        flex: '1',
        maxHeight: 'calc(100% - 20mm)'
      }}>
        {instructions || "Follow your heart and let the memories guide each step. Cook with love, season with emotion, and serve with the warmth of cherished moments."}
      </div>
    </div>
  );
};
