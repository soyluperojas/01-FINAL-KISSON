
import { useEffect } from "react";
import { getPrintPageStyles } from "./print-styles/PrintPageStyles";
import { getPrintContentStyles } from "./print-styles/PrintContentStyles";
import { getPrintRecipeStyles } from "./print-styles/PrintRecipeStyles";
import { getPrintLogoStyles } from "./print-styles/PrintLogoStyles";
import { getPrintScreenStyles } from "./print-styles/PrintScreenStyles";
import { getPrintScreenOptimizations } from "./print-styles/PrintScreenOptimizations";
import { getPrintCoreOptimizations } from "./print-styles/PrintCoreOptimizations";
import { getPrintLayoutStyles } from "./print-styles/PrintLayoutStyles";
import { getPrintQRStyles } from "./print-styles/PrintQRStyles";
import { getPrintTextOverrides } from "./print-styles/PrintTextOverrides";
import { getPrintGlobalOverrides } from "./print-styles/PrintGlobalOverrides";

export const PrintStyles = () => {
  useEffect(() => {
    const style = document.createElement('style');
    
    style.innerHTML = `
      @media screen {
        ${getPrintScreenStyles()}
        ${getPrintScreenOptimizations()}
      }
      
      @media print {
        ${getPrintPageStyles()}
        ${getPrintCoreOptimizations()}
        ${getPrintLayoutStyles()}
        ${getPrintLogoStyles()}
        ${getPrintContentStyles()}
        ${getPrintRecipeStyles()}
        ${getPrintQRStyles()}
        ${getPrintTextOverrides()}
        ${getPrintGlobalOverrides()}
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
};
