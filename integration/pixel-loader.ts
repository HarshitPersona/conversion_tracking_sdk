// Pier39 Conversion Tracking Pixel Loader
// This script creates the global pier39 function and loads the main SDK

import { ConversionPixelSDK } from '../src/types';

declare global {
  interface Window {
    [key: string]: any;
  }
}

(function () {
  const w = window as any;
  const d = document;
  const pixelName = 'pier39';
  const sdkUrl = 'https://cdn.personapay.ai/pixel.min.js';
  
  // Set the global pixel object name
  w.Pier39PixelObject = pixelName;
  
  let sdk: ConversionPixelSDK | null = null;
  
  // Create the global pier39 function with queue support
  w[pixelName] = function (...args: any[]) {
    if (sdk) {
      handleCommand.apply(null, args);
    } else {
      (w[pixelName].q = w[pixelName].q || []).push(args);
    }
  };

  function handleCommand(...args: any[]): void {
    const [command, eventType, data] = args;
    if (!sdk) return;
    
    if (command === 'track' && eventType && data) {
      sdk.track(eventType, data);
    } else {
      console.warn('Unknown pier39 command:', command);
    }
  }
  
  // Load the SDK script
  const script = d.createElement('script');
  script.async = true;
  script.src = sdkUrl;
  
  script.onload = function () {
    try {
      if (!w.Pier39ConversionSDK?.initializeSDK) {
        console.error('Pier39 conversion tracking script failed to load');
        return;
      }
      
      sdk = w.Pier39ConversionSDK.initializeSDK();
      
      if (!sdk) {
        console.error('Pier39 conversion SDK initialization failed');
        return;
      }
      
      // Process queued commands
      const queue = w[pixelName].q || [];
      for (const args of queue) {
        if (args?.length > 0) {
          handleCommand.apply(null, args);
        }
      }
      
      // Clear the queue
      w[pixelName].q = [];
      
    } catch (error) {
      console.error('Pier39 conversion SDK initialization error:', error);
    }
  };
  
  script.onerror = function () {
    console.error('Failed to load Pier39 conversion tracking script');
  };
  
  // Insert the script
  const firstScript = d.getElementsByTagName('script')[0];
  if (firstScript?.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  }
})(); 