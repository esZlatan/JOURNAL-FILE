import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import html2canvas from 'html2canvas';

interface FullExportButtonProps {
  className?: string;
}

/**
 * A button component that captures and saves the full dashboard as an image
 */
export const FullExportButton: React.FC<FullExportButtonProps> = ({ className = "" }) => {
  const handleExport = async () => {
    const dashboardElement = document.getElementById('dashboard-root');
    
    if (!dashboardElement) {
      console.error('Dashboard element not found');
      return;
    }
    
    try {
      // Show a loading state
      const originalText = document.querySelector('.export-button-text')?.textContent;
      if (document.querySelector('.export-button-text')) {
        document.querySelector('.export-button-text')!.textContent = 'Capturing...';
      }
      
      // Set up html2canvas options for better quality
      const canvas = await html2canvas(dashboardElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // Enable CORS for external images
        allowTaint: true,
        backgroundColor: getComputedStyle(document.body).backgroundColor || '#ffffff',
        logging: false,
      });
      
      // Create a download link
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
      link.download = `trading-dashboard-${timestamp}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      // Restore button text
      if (document.querySelector('.export-button-text')) {
        document.querySelector('.export-button-text')!.textContent = originalText || 'Save Full Dashboard';
      }
    } catch (error) {
      console.error('Error capturing dashboard:', error);
      
      // Restore button text in case of error
      if (document.querySelector('.export-button-text')) {
        document.querySelector('.export-button-text')!.textContent = 'Save Full Dashboard';
      }
    }
  };
  
  return (
    <Button 
      onClick={handleExport} 
      className={`flex items-center space-x-1 ${className}`}
      variant="secondary"
    >
      <Save className="h-4 w-4" />
      <span className="export-button-text">Save Full Dashboard</span>
    </Button>
  );
};

export default FullExportButton;