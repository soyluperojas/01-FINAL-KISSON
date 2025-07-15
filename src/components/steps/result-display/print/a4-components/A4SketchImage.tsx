
interface A4SketchImageProps {
  imageUrl: string;
}

export const A4SketchImage = ({ imageUrl }: A4SketchImageProps) => {
  return (
    <div style={{
      width: '100%',
      height: '50mm',
      border: '1px solid #ddd',
      overflow: 'hidden',
      backgroundColor: '#f9f9f9'
    }}>
      <img 
        src={imageUrl}
        alt="Recipe Image"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
        onError={(e) => {
          const target = e.target as HTMLElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666; font-size: 9pt;">Recipe Image</div>';
          }
        }}
      />
    </div>
  );
};
