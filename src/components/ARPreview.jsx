import { useEffect, useRef, useState } from "react";
import "./ARPreview.css";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/* object-fit: cover source rect, so canvas capture matches what's on screen */
function coverSourceRect(containerW, containerH, mediaW, mediaH) {
  const containerRatio = containerW / containerH;
  const mediaRatio = mediaW / mediaH;
  if (mediaRatio > containerRatio) {
    const sh = mediaH;
    const sw = mediaH * containerRatio;
    return { sx: (mediaW - sw) / 2, sy: 0, sw, sh };
  }
  const sw = mediaW;
  const sh = mediaW / containerRatio;
  return { sx: 0, sy: (mediaH - sh) / 2, sw, sh };
}

function describeCameraError(err) {
  if (err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError") {
    return "Camera access was blocked. Allow camera permission for this site in your browser settings, then try again.";
  }
  if (err?.name === "NotFoundError" || err?.name === "DevicesNotFoundError") {
    return "No camera was found on this device.";
  }
  if (err?.name === "NotReadableError") {
    return "The camera is already in use by another app.";
  }
  return "Couldn't access the camera. Make sure you're on a secure (https) page and try again.";
}

export default function ARPreview({ color, onClose }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const panelImgRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const pointersRef = useRef(new Map());
  const modeRef = useRef(null);
  const gestureRef = useRef({});

  const [status, setStatus] = useState("requesting"); /* requesting | streaming | error | unsupported */
  const [errorMessage, setErrorMessage] = useState("");
  const [transform, setTransform] = useState({ x: 0, y: 0, size: 160, rotation: 0 });
  const [capturedImage, setCapturedImage] = useState(null);
  const [hintVisible, setHintVisible] = useState(true);

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    function onKey(e) {
      if (e.key === "Escape") onCloseRef.current();
    }
    document.addEventListener("keydown", onKey);

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("unsupported");
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", onKey);
      };
    }

    let cancelled = false;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        const rect = containerRef.current.getBoundingClientRect();
        const size = Math.min(rect.width, rect.height) * 0.42;
        setTransform({ x: rect.width / 2, y: rect.height / 2, size, rotation: 0 });
        setStatus("streaming");
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus("error");
        setErrorMessage(describeCameraError(err));
      });

    return () => {
      cancelled = true;
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function getPoint(e) {
    const rect = containerRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function attachWindowListeners() {
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
  }
  function detachWindowListeners() {
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
    window.removeEventListener("pointercancel", handlePointerUp);
  }

  function handlePanelPointerDown(e) {
    e.preventDefault();
    setHintVisible(false);
    const pt = getPoint(e);
    const firstPointer = pointersRef.current.size === 0;
    pointersRef.current.set(e.pointerId, pt);

    if (pointersRef.current.size === 1) {
      modeRef.current = "drag";
      gestureRef.current = { pointer: pt, x: transform.x, y: transform.y };
    } else if (pointersRef.current.size === 2) {
      const pts = [...pointersRef.current.values()];
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      const angle = (Math.atan2(pts[1].y - pts[0].y, pts[1].x - pts[0].x) * 180) / Math.PI;
      modeRef.current = "pinch";
      gestureRef.current = { size: transform.size, rotation: transform.rotation, dist, angle };
    }
    if (firstPointer) attachWindowListeners();
  }

  function handleResizePointerDown(e) {
    e.preventDefault();
    e.stopPropagation();
    setHintVisible(false);
    const pt = getPoint(e);
    pointersRef.current.set(e.pointerId, pt);
    modeRef.current = "resize";
    gestureRef.current = {
      cx: transform.x,
      cy: transform.y,
      startDist: Math.hypot(pt.x - transform.x, pt.y - transform.y) || 1,
      startSize: transform.size,
    };
    attachWindowListeners();
  }

  function handlePointerMove(e) {
    if (!pointersRef.current.has(e.pointerId)) return;
    const pt = getPoint(e);
    pointersRef.current.set(e.pointerId, pt);

    if (modeRef.current === "drag" && pointersRef.current.size === 1) {
      const { pointer, x, y } = gestureRef.current;
      setTransform((t) => ({ ...t, x: x + (pt.x - pointer.x), y: y + (pt.y - pointer.y) }));
    } else if (modeRef.current === "pinch" && pointersRef.current.size === 2) {
      const pts = [...pointersRef.current.values()];
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      const angle = (Math.atan2(pts[1].y - pts[0].y, pts[1].x - pts[0].x) * 180) / Math.PI;
      const { size, rotation, dist: startDist, angle: startAngle } = gestureRef.current;
      const scale = dist / startDist;
      setTransform((t) => ({
        ...t,
        size: clamp(size * scale, 50, 1200),
        rotation: rotation + (angle - startAngle),
      }));
    } else if (modeRef.current === "resize") {
      const { cx, cy, startDist, startSize } = gestureRef.current;
      const dist = Math.hypot(pt.x - cx, pt.y - cy);
      setTransform((t) => ({ ...t, size: clamp(startSize * (dist / startDist), 50, 1200) }));
    }
  }

  function handlePointerUp(e) {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size === 0) {
      modeRef.current = null;
      detachWindowListeners();
    } else if (pointersRef.current.size === 1 && modeRef.current === "pinch") {
      const [pt] = pointersRef.current.values();
      modeRef.current = "drag";
      gestureRef.current = { pointer: pt, x: transform.x, y: transform.y };
    }
  }

  function resetTransform() {
    const rect = containerRef.current.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height) * 0.42;
    setTransform({ x: rect.width / 2, y: rect.height / 2, size, rotation: 0 });
  }

  function capture() {
    const container = containerRef.current;
    const video = videoRef.current;
    const panelImg = panelImgRef.current;
    if (!container || !video || !panelImg || video.videoWidth === 0) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const canvas = canvasRef.current;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");

    const { sx, sy, sw, sh } = coverSourceRect(rect.width, rect.height, video.videoWidth, video.videoHeight);
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

    const scaleFactor = canvas.width / rect.width;
    const size = transform.size * scaleFactor;
    ctx.save();
    ctx.translate(transform.x * scaleFactor, transform.y * scaleFactor);
    ctx.rotate((transform.rotation * Math.PI) / 180);
    ctx.drawImage(panelImg, -size / 2, -size / 2, size, size);
    ctx.restore();

    setCapturedImage(canvas.toDataURL("image/jpeg", 0.92));
  }

  function retake() {
    setCapturedImage(null);
  }

  function slug() {
    return (color.name || color.id || "color").replace(/[^\w-]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase();
  }

  async function savePhoto() {
    if (!capturedImage) return;
    try {
      const res = await fetch(capturedImage);
      const blob = await res.blob();
      const file = new File([blob], `${slug()}-in-your-home.jpg`, { type: "image/jpeg" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: color.name });
        return;
      }
    } catch {
      /* fall through to download */
    }
    const a = document.createElement("a");
    a.href = capturedImage;
    a.download = `${slug()}-in-your-home.jpg`;
    a.click();
  }

  return (
    <div className="ar-overlay" role="dialog" aria-modal="true" aria-label={`View ${color.name} in your home`}>
      <div className="ar-topbar">
        <span className="ar-topbar-title">{(color.name || "").replace(/\n/g, " · ")}</span>
        <button type="button" className="ar-close" onClick={onClose} aria-label="Close AR preview">×</button>
      </div>

      <div className="ar-stage" ref={containerRef}>
        {status === "streaming" && !capturedImage && (
          <>
            <video ref={videoRef} className="ar-video" playsInline muted autoPlay />
            <div
              className="ar-panel"
              onPointerDown={handlePanelPointerDown}
              style={{
                left: transform.x,
                top: transform.y,
                width: transform.size,
                height: transform.size,
                transform: `translate(-50%, -50%) rotate(${transform.rotation}deg)`,
              }}
            >
              <img
                ref={panelImgRef}
                src={color.image}
                alt=""
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
              />
              <div
                className="ar-resize-handle"
                onPointerDown={handleResizePointerDown}
                aria-hidden="true"
              />
            </div>
            {hintVisible && (
              <div className="ar-hint">Drag the sample onto a wall or cabinet · Pinch with two fingers to resize &amp; rotate</div>
            )}
          </>
        )}

        {capturedImage && (
          <img className="ar-captured" src={capturedImage} alt={`${color.name} preview in your home`} />
        )}

        {status === "requesting" && (
          <div className="ar-message">
            <p>Requesting camera access…</p>
          </div>
        )}

        {status === "error" && (
          <div className="ar-message">
            <p>{errorMessage}</p>
            <button type="button" className="ar-btn" onClick={onClose}>Close</button>
          </div>
        )}

        {status === "unsupported" && (
          <div className="ar-message">
            <p>Live camera preview isn't supported in this browser. Try opening this page in Safari or Chrome on your phone.</p>
            <button type="button" className="ar-btn" onClick={onClose}>Close</button>
          </div>
        )}
      </div>

      {status === "streaming" && (
        <div className="ar-toolbar">
          {capturedImage ? (
            <>
              <button type="button" className="ar-btn" onClick={retake}>Retake</button>
              <button type="button" className="ar-btn ar-btn-primary" onClick={savePhoto}>Save Photo</button>
            </>
          ) : (
            <>
              <button type="button" className="ar-btn" onClick={resetTransform}>Reset</button>
              <button type="button" className="ar-btn ar-btn-primary" onClick={capture}>Take Photo</button>
            </>
          )}
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
