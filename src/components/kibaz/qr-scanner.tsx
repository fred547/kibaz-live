import { useCallback, useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { Camera, ImageUp } from "lucide-react";
import { Button } from "@/components/ui/button";

type Detector = {
  detect: (source: CanvasImageSource) => Promise<Array<{ rawValue: string }>>;
};

function nativeDetector(): Detector | null {
  const Ctor = (globalThis as { BarcodeDetector?: new (opts: { formats: string[] }) => Detector }).BarcodeDetector;
  if (!Ctor) return null;
  try {
    return new Ctor({ formats: ["qr_code"] });
  } catch {
    return null;
  }
}

function decodeImageData(image: ImageData) {
  const result = jsQR(image.data, image.width, image.height, { inversionAttempts: "attemptBoth" });
  return result?.data?.trim() || null;
}

async function decodeCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  detector: Detector | null,
) {
  if (width < 8 || height < 8) return null;
  if (detector) {
    try {
      const codes = await detector.detect(ctx.canvas);
      const text = codes[0]?.rawValue?.trim();
      if (text) return text;
    } catch {
      // Fall through to jsQR.
    }
  }
  return decodeImageData(ctx.getImageData(0, 0, width, height));
}

export function QrScanner({
  active,
  onDetect,
}: {
  active: boolean;
  onDetect: (text: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef(0);
  const decodingRef = useRef(false);
  const detectorRef = useRef<Detector | null>(null);
  const [live, setLive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const stop = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    const video = videoRef.current;
    if (video) video.srcObject = null;
    setLive(false);
  }, []);

  const readFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = (canvasRef.current ??= document.createElement("canvas"));
    if (!video || !canvas || video.readyState < 2) {
      frameRef.current = requestAnimationFrame(readFrame);
      return;
    }
    const width = video.videoWidth;
    const height = video.videoHeight;
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (ctx && !decodingRef.current) {
        decodingRef.current = true;
        ctx.drawImage(video, 0, 0);
        void decodeCanvas(ctx, width, height, detectorRef.current)
          .then((text) => {
            if (text) onDetect(text);
          })
          .finally(() => {
            decodingRef.current = false;
          });
      }
    }
    frameRef.current = requestAnimationFrame(readFrame);
  }, [onDetect]);

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("This browser has no camera.");
      return;
    }
    setBusy(true);
    setError(null);
    stop();
    detectorRef.current = nativeDetector();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: "environment" } },
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      video.srcObject = stream;
      await video.play();
      setLive(true);
      frameRef.current = requestAnimationFrame(readFrame);
    } catch {
      setError("Camera is blocked. Allow it, or take a photo of the stub.");
    } finally {
      setBusy(false);
    }
  }, [readFrame, stop]);

  useEffect(() => {
    if (active) void start();
    else stop();
    return stop;
  }, [active, start, stop]);

  async function onPhoto(file: File | undefined) {
    if (!file) return;
    setError(null);
    try {
      const bitmap = await createImageBitmap(file);
      const canvas = (canvasRef.current ??= document.createElement("canvas"));
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(bitmap, 0, 0);
      const text = await decodeCanvas(ctx, bitmap.width, bitmap.height, nativeDetector());
      if (text) onDetect(text);
      else setError("No Kibaz code in that photo. Fill the frame with the stub.");
    } catch {
      setError("Could not read that photo.");
    }
  }

  return (
    <div>
      <div className="relative overflow-hidden rounded-card bg-ink shadow-card">
        <video
          ref={videoRef}
          className="aspect-square w-full object-cover"
          playsInline
          muted
          autoPlay
        />
        {!live ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink px-6 text-center">
            <Camera className="size-8 text-card" />
            <p className="font-display text-base font-semibold text-card">Counter camera</p>
            <p className="text-sm text-card/80">Point at the Kibaz stub. The code is enough.</p>
          </div>
        ) : null}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="size-52 rounded-md ring-2 ring-card/90" />
        </div>
      </div>

      {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button type="button" onClick={() => void start()} disabled={busy}>
          <Camera className="size-4" />
          {live ? "Camera on" : "Open camera"}
        </Button>
        <Button variant="secondary" type="button" asChild>
          <label className="cursor-pointer">
            <ImageUp className="size-4" />
            Photo of stub
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                void onPhoto(file);
              }}
            />
          </label>
        </Button>
      </div>
    </div>
  );
}
