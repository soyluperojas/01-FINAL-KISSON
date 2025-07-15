
import { JSX } from 'react';

interface ContentRendererProps {
  lines: string[];
  startY: number;
  fontSize: number;
  lineHeight: number;
  margin: number;
  keyPrefix: string;
  fontWeight?: 'bold' | 'normal';
  fontStyle?: 'italic' | 'normal';
}

export const ContentRenderer = ({
  lines,
  startY,
  fontSize,
  lineHeight,
  margin,
  keyPrefix,
  fontWeight = 'normal',
  fontStyle = 'normal'
}: ContentRendererProps): JSX.Element[] => {
  return lines.map((line, index) => (
    <div
      key={`${keyPrefix}-${index}`}
      style={{
        position: 'absolute',
        top: `${startY + (index * lineHeight)}px`,
        left: `${margin}px`,
        fontSize: `${fontSize}pt`,
        lineHeight: '1.2',
        fontFamily: 'Arial, sans-serif',
        fontWeight,
        fontStyle,
        color: 'black',
        whiteSpace: 'nowrap'
      }}
    >
      {line}
    </div>
  ));
};
