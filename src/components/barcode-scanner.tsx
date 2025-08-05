
"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { Button } from './ui/button';
import { Loader, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BarcodeScannerProps {
  onScanSuccess: (result: string) => void;
  onClose: () => void;
}

export function BarcodeScanner({ onScanSuccess, onClose }: BarcodeScannerProps) {
  const webcamRef = useRef<Webcam>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const codeReader = useRef(new BrowserMultiFormatReader());

  const startScan = useCallback(async () => {
    if (webcamRef.current?.video) {
      try {
        const result = await codeReader.current.decodeFromVideoElement(webcamRef.current.video);
        if (result) {
          onScanSuccess(result.getText());
        }
      } catch (err) {
        if (!(err instanceof NotFoundException)) {
          console.error('Barcode decoding error:', err);
          setError('An error occurred during scanning.');
        }
      }
    }
  }, [onScanSuccess]);


  useEffect(() => {
    const interval = setInterval(() => {
        if (webcamRef.current?.video) {
            startScan();
        }
    }, 500);
    return () => clearInterval(interval);
  }, [startScan]);


  return (
    <div className="absolute inset-0 bg-black z-30 flex flex-col items-center justify-center">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-40 text-white hover:bg-white/20 hover:text-white"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>

      {error ? (
        <div className="text-white text-center p-4">
          <h2 className="text-xl font-bold">Scan Error</h2>
          <p>{error}</p>
        </div>
      ) : (
        <>
            <Webcam
                ref={webcamRef}
                audio={false}
                videoConstraints={{ facingMode: "environment" }}
                className="w-full h-full object-cover"
                onUserMediaError={(err) => {
                    console.error("Webcam Error:", err);
                    setError("Could not access the camera. Please check permissions.");
                    toast({
                        title: "Camera Error",
                        description: "Could not access the camera. Please check permissions in your browser.",
                        variant: "destructive"
                    })
                }}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-3/4 max-w-md h-1/2 border-4 border-dashed border-primary rounded-lg" />
            </div>
            <div className="absolute bottom-16 text-white bg-black/50 p-2 rounded-md">
                Point your camera at a barcode or QR code
            </div>
        </>
      )}
    </div>
  );
}
