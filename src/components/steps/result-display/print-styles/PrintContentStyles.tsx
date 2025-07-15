
export const getPrintContentStyles = () => `
  /* MAIN PRINT AREA - ABSOLUTE WHITE BACKGROUND */
  #print-area {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 4in !important;
    height: 6in !important;
    max-width: 4in !important;
    max-height: 6in !important;
    padding: 0.1in !important;
    margin: 0 !important;
    overflow: hidden !important;
    background: white !important;
    background-color: white !important;
    background-image: none !important;
    display: flex !important;
    flex-direction: column !important;
    
    font-size: 7pt !important;
    line-height: 1.1 !important;
    font-family: 'Courier Prime', 'Courier New', monospace !important;
    color: black !important;
    
    border: none !important;
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
    opacity: 1 !important;
    box-shadow: none !important;
  }
  
  /* Recipe title styling */
  .recipe-title {
    font-size: 9pt !important;
    margin: 0 !important;
    padding: 2px 0 !important;
    font-weight: bold !important;
    color: black !important;
    background: white !important;
    background-color: white !important;
    text-align: center !important;
    line-height: 1.0 !important;
    max-height: 0.4in !important;
    overflow: hidden !important;
    flex-shrink: 0 !important;
    border: none !important;
    font-family: 'Courier Prime', 'Courier New', monospace !important;
  }
  
  .recipe-title h1 {
    font-size: 9pt !important;
    margin: 0 !important;
    padding: 2px 0 !important;
    line-height: 1.0 !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
    color: black !important;
    background: white !important;
    background-color: white !important;
    border: none !important;
    font-family: 'Courier Prime', 'Courier New', monospace !important;
  }
`;
