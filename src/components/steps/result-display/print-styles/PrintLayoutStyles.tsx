
export const getPrintLayoutStyles = () => `
  /* Print-specific layout optimizations */
  @media print {
    .print-layout {
      display: flex !important;
      background: white !important;
      background-color: white !important;
      color: black !important;
      border: none !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 4in !important;
      height: 6in !important;
      z-index: 999 !important;
    }
    
    .screen-layout {
      display: none !important;
    }
  }
  
  /* Screen-specific layout optimizations */
  @media screen {
    .screen-layout {
      display: block !important;
    }
    
    .print-layout {
      display: none !important;
    }
  }

  /* ULTRA AGGRESSIVE CARD BACKGROUND OVERRIDE */
  .recipe-card-container,
  .recipe-card-container *,
  [class*="card"],
  [class*="Card"],
  #print-area,
  #print-area * {
    background: white !important;
    background-color: white !important;
    background-image: none !important;
    color: black !important;
    border: none !important;
    box-shadow: none !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
    visibility: visible !important;
  }
  
  /* Hide everything except print area initially */
  body * {
    visibility: hidden !important;
    background: white !important;
    background-color: white !important;
  }
  
  /* Show only the print area */
  #print-area, #print-area * {
    visibility: visible !important;
    background: white !important;
    background-color: white !important;
    color: black !important;
  }
  
  /* Content columns styling - wider recipe content */
  .recipe-content-column {
    width: 2.8in !important;
    max-width: 2.8in !important;
    overflow: hidden !important;
    flex-shrink: 0 !important;
    background: white !important;
    background-color: white !important;
    border: none !important;
  }
  
  .qr-column {
    flex: 1 !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    gap: 2px !important;
    overflow: hidden !important;
    background: white !important;
    background-color: white !important;
    border: none !important;
  }
`;
