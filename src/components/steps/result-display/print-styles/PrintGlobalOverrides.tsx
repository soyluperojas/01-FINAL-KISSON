
export const getPrintGlobalOverrides = () => `
  /* Hide non-printable elements */
  .no-print {
    display: none !important;
    visibility: hidden !important;
  }
  
  /* NUCLEAR OVERRIDE FOR ALL BORDERS AND OUTLINES */
  * {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    background: white !important;
    background-color: white !important;
    background-image: none !important;
    color: black !important;
  }
  
  /* NUCLEAR OVERRIDE FOR ALL TAILWIND CLASSES */
  [class*="bg-"], 
  [class*="background"],
  [style*="background"],
  [style*="rgba"], 
  [style*="rgb"],
  [class*="text-gray"],
  [class*="text-slate"],
  [class*="text-black"],
  [class*="border"],
  [class*="outline"] {
    background: white !important;
    background-color: white !important;
    background-image: none !important;
    border: none !important;
    outline: none !important;
    color: black !important;
    box-shadow: none !important;
    border-radius: 0 !important;
  }
  
  /* Force flex layouts to have white backgrounds and no borders */
  [class*="flex"] {
    background: white !important;
    background-color: white !important;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
  }
  
  /* ABSOLUTE FINAL OVERRIDE - NO BORDERS ANYWHERE */
  .recipe-card-container,
  .recipe-card-container > *,
  .recipe-card-container > * > *,
  .recipe-card-container > * > * > *,
  .recipe-card-container > * > * > * > *,
  #recipe-print-area,
  #recipe-print-area *,
  #print-area,
  #print-area * {
    background: white !important;
    background-color: white !important;
    background-image: none !important;
    color: black !important;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    border-radius: 0 !important;
  }
`;
