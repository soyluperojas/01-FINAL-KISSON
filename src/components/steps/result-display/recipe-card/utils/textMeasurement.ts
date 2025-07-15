
export const createTextMeasurer = (fontSize: number): HTMLElement => {
  const measurer = document.createElement('div');
  measurer.style.position = 'absolute';
  measurer.style.visibility = 'hidden';
  measurer.style.fontSize = `${fontSize}pt`;
  measurer.style.fontFamily = 'Arial, sans-serif';
  measurer.style.whiteSpace = 'nowrap';
  document.body.appendChild(measurer);
  return measurer;
};

export const measureText = (text: string, measurer: HTMLElement): number => {
  measurer.textContent = text;
  return measurer.offsetWidth;
};

export const cleanupMeasurer = (measurer: HTMLElement): void => {
  if (measurer.parentNode) {
    document.body.removeChild(measurer);
  }
};
