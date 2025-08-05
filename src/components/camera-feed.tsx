"use client";

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Video, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface CameraFeedProps {}

export interface CameraFeedHandle {
  capture: () => string | null;
}

const CameraFeed = forwardRef<CameraFeedHandle, CameraFeedProps>((props, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let unmounted = false;

    const enableCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: 'environment', // prefer back camera
              width: { ideal: 1920 },
              height: { ideal: 1080 },
            },
          });
          if (unmounted) {
            stream.getTracks().forEach(track => track.stop());
            return;
          }
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              if (!unmounted) setIsCameraReady(true);
            };
          }
        } else {
          setError('Camera access is not supported by this browser.');
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        setError('Could not access camera. Please check permissions and ensure you are using a secure (HTTPS) connection.');
      }
    };

    enableCamera();

    return () => {
      unmounted = true;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useImperativeHandle(ref, () => ({
    capture: () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && isCameraReady) {
        const context = canvas.getContext('2d');
        if (context) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
          return canvas.toDataURL('image/jpeg', 0.9);
        }
      }
      return null;
    },
  }));

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-muted text-muted-foreground p-8 text-center">
        <AlertTriangle className="w-16 h-16 mb-4 text-destructive" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Camera Error</h2>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden">
      {!isCameraReady && <Skeleton className="absolute inset-0" />}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transition-opacity duration-500 ${isCameraReady ? 'opacity-100' : 'opacity-0'}`}
      />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
});

CameraFeed.displayName = 'CameraFeed';

export default CameraFeed;
