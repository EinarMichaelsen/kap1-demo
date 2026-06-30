"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Downscale a captured frame before sending — keeps the request small and fast.
const MAX_EDGE = 1280;
const JPEG_QUALITY = 0.85;

function dataUrlToParts(dataUrl) {
  // "data:image/jpeg;base64,XXXX" -> { mediaType, base64 }
  const [meta, base64] = dataUrl.split(",");
  const mediaType = meta.slice(5, meta.indexOf(";"));
  return { mediaType, base64 };
}

function downscaleToDataUrl(source, width, height) {
  let w = width;
  let h = height;
  if (Math.max(w, h) > MAX_EDGE) {
    const scale = MAX_EDGE / Math.max(w, h);
    w = Math.round(w * scale);
    h = Math.round(h * scale);
  }
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(source, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

export default function CameraAnalyzer() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [photo, setPhoto] = useState(null); // data URL of captured/selected image
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const stopCamera = useCallback(() => {
    const stream = streamRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
  }, []);

  const startCamera = useCallback(async () => {
    setError("");
    setCameraError(false);
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(true);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraReady(true);
    } catch {
      setCameraError(true);
    }
  }, []);

  // Start the camera on mount; clean up on unmount.
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const analyze = useCallback(async (dataUrl) => {
    setLoading(true);
    setError("");
    setAnswer("");
    try {
      const { mediaType, base64 } = dataUrlToParts(dataUrl);
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mediaType }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Noe gikk galt.");
      }
      setAnswer(data.answer);
    } catch (err) {
      setError(err.message || "Klarte ikke å analysere bildet.");
    } finally {
      setLoading(false);
    }
  }, []);

  const capture = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const dataUrl = downscaleToDataUrl(
      video,
      video.videoWidth,
      video.videoHeight
    );
    setPhoto(dataUrl);
    stopCamera();
    analyze(dataUrl);
  }, [analyze, stopCamera]);

  const onFileSelected = useCallback(
    (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const dataUrl = downscaleToDataUrl(img, img.width, img.height);
          setPhoto(dataUrl);
          analyze(dataUrl);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    },
    [analyze]
  );

  const reset = useCallback(() => {
    setPhoto(null);
    setAnswer("");
    setError("");
    startCamera();
  }, [startCamera]);

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
        <div className="relative aspect-[3/4] w-full bg-black/40">
          {/* Live camera */}
          {!photo && (
            <video
              ref={videoRef}
              playsInline
              muted
              className="h-full w-full object-cover"
            />
          )}

          {/* Captured / selected photo */}
          {photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt="Bildet du tok"
              className="h-full w-full object-cover"
            />
          )}

          {/* Camera unavailable state */}
          {!photo && cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="text-sm text-white/70">
                Fikk ikke tilgang til kameraet. Du kan laste opp et bilde i
                stedet.
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-full bg-brand-yellow px-5 py-2 font-display text-sm uppercase tracking-wide text-maroon"
              >
                Velg bilde
              </button>
            </div>
          )}

          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="animate-pulse font-display text-lg uppercase tracking-wide text-brand-yellow">
                Analyserer …
              </span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 border-t border-white/10 p-4">
          {!photo && cameraReady && (
            <button
              type="button"
              onClick={capture}
              disabled={loading}
              className="rounded-full bg-brand-yellow px-8 py-3 font-display text-base uppercase tracking-wide text-maroon transition hover:brightness-95 disabled:opacity-50"
            >
              Ta bilde
            </button>
          )}

          {!photo && !cameraReady && !cameraError && (
            <span className="py-3 text-sm text-white/50">Starter kamera …</span>
          )}

          {photo && (
            <button
              type="button"
              onClick={reset}
              disabled={loading}
              className="rounded-full border border-white/20 bg-white/5 px-6 py-3 font-display text-sm uppercase tracking-wide text-white transition hover:bg-white/10 disabled:opacity-50"
            >
              Ta nytt bilde
            </button>
          )}
        </div>
      </div>

      {/* Hidden file input — fallback when the camera isn't available */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onFileSelected}
        className="hidden"
      />

      {/* Result */}
      {error && (
        <div className="mt-5 rounded-xl border border-red-300/30 bg-red-500/10 p-4 text-sm text-red-100">
          {error}
        </div>
      )}

      {answer && (
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h2 className="font-display text-lg uppercase tracking-wide text-brand-yellow">
            Svar fra AI
          </h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-white/85">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}
