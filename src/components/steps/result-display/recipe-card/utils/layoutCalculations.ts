
export interface LayoutDimensions {
  containerWidth: number;
  containerHeight: number;
  qrWidth: number;
  qrHeight: number;
  logoWidth: number;
  logoHeight: number;
  margin: number;
}

export const calculateAvailableWidth = (
  y: number,
  height: number,
  dimensions: LayoutDimensions
): number => {
  const { containerWidth, qrWidth, qrHeight, logoWidth, logoHeight, margin, containerHeight } = dimensions;
  let width = containerWidth - (margin * 2);
  
  // QR code area calculations
  const qrLeft = containerWidth - qrWidth - margin;
  const qrTop = margin;
  const qrBottom = qrTop + qrHeight + margin;
  
  // Logo area calculations
  const logoLeft = containerWidth - logoWidth - margin;
  const logoTop = containerHeight - logoHeight - margin;
  
  // Check QR code overlap
  if (y < qrBottom && y + height > qrTop) {
    width = qrLeft - margin - margin;
  }
  
  // Check logo overlap
  if (y + height > logoTop && y < containerHeight - margin) {
    width = Math.min(width, logoLeft - margin - margin);
  }
  
  return Math.max(width, 80);
};

export const parseContentSections = (content: string) => {
  const sections = content.split(/\n\s*\n/).filter(s => s.trim());
  let title = "";
  let memoryParagraph = "";
  let recipeContent = "";

  if (sections.length >= 1) {
    title = sections[0].trim();
  }
  if (sections.length >= 2) {
    memoryParagraph = sections[1].trim();
  }
  if (sections.length >= 3) {
    recipeContent = sections.slice(2).join('\n\n').trim();
  }

  // If parsing failed, treat first line as title and rest as recipe
  if (!recipeContent && memoryParagraph) {
    recipeContent = memoryParagraph;
    memoryParagraph = "";
  }

  return { title, memoryParagraph, recipeContent };
};
