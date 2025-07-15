
export const getPrintPageStyles = () => `
  /* PRINT PAGE SETUP */
  @page {
    size: 4in 6in;
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
    background-color: white !important;
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
  
  /* FORCE WHITE BACKGROUNDS */
  html, body {
    background: white !important;
    background-color: white !important;
    color: black !important;
    width: 4in !important;
    height: 6in !important;
    margin: 0 !important;
    padding: 0 !important;
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
    font-family: 'Courier Prime', 'Courier New', monospace !important;
  }
  
  /* RECIPE CARD CONTAINER */
  .recipe-card-container,
  .recipe-card-container *,
  #recipe-print-area,
  #recipe-print-area * {
    background: white !important;
    background-color: white !important;
    background-image: none !important;
    color: black !important;
    border-color: #ccc !important;
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
    visibility: visible !important;
    font-family: 'Courier Prime', 'Courier New', monospace !important;
  }
  
  /* HIDE NON-PRINT ELEMENTS */
  .no-print {
    display: none !important;
    visibility: hidden !important;
  }
  
  /* SHOW ONLY PRINT AREA */
  body * {
    visibility: hidden !important;
  }
  
  #recipe-print-area, 
  #recipe-print-area * {
    visibility: visible !important;
  }
  
  /* FORCE BLACK TEXT */
  * {
    color: black !important;
    background: white !important;
    background-color: white !important;
    border-color: #ccc !important;
    font-family: 'Courier Prime', 'Courier New', monospace !important;
  }
`;
