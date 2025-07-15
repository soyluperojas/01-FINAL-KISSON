
interface A4SketchIngredientsProps {
  ingredients: string[];
}

export const A4SketchIngredients = ({ ingredients }: A4SketchIngredientsProps) => {
  return (
    <div style={{ flex: '1' }}>
      <h2 style={{
        fontSize: '12pt',
        fontWeight: 'bold',
        margin: '0 0 4mm 0',
        color: '#333'
      }}>
        Ingredients
      </h2>
      
      {ingredients.length > 0 ? (
        <ul style={{ 
          margin: '0', 
          paddingLeft: '8mm',
          fontSize: '8pt',
          lineHeight: '1.3'
        }}>
          {ingredients.slice(0, 10).map((ingredient, index) => (
            <li key={index} style={{ 
              marginBottom: '1mm',
              color: '#444'
            }}>
              {ingredient}
            </li>
          ))}
        </ul>
      ) : (
        <div style={{ 
          fontStyle: 'italic', 
          color: '#666',
          fontSize: '8pt',
          lineHeight: '1.3'
        }}>
          Emotional ingredients that tell a story through taste and memory.
        </div>
      )}
    </div>
  );
};
