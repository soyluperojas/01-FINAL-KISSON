
export const getPrintScreenStyles = () => `
  /* Make the screen display exactly match the print layout */
  .recipe-card-container {
    width: 4in !important;
    height: 6in !important;
    max-width: 4in !important;
    max-height: 6in !important;
    min-width: 4in !important;
    min-height: 6in !important;
    margin: 0 auto !important;
    border: 1px solid #ccc !important;
    background: white !important;
    overflow: hidden !important;
  }
  
  /* Logo positioning for screen - larger size with padding */
  .logo-container {
    position: absolute !important;
    bottom: 8px !important;
    right: 8px !important;
    z-index: 10 !important;
    width: 1.2in !important;
    height: 1.2in !important;
    padding: 8px !important;
    background-color: white !important;
    border-radius: 4px !important;
  }
  
  .logo-container img {
    width: calc(1.2in - 16px) !important;
    height: calc(1.2in - 16px) !important;
    object-fit: contain !important;
    display: block !important;
  }
`;
