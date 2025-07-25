import React, { useState, useRef } from "react";

export default function ImageCropper() {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const imageRef = useRef(null);
  const startPoint = useRef({ x: 0, y: 0 });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    startPoint.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setIsDragging(true);
    setCrop({
      x: startPoint.current.x,
      y: startPoint.current.y,
      width: 0,
      height: 0,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    let x = Math.min(currentX, startPoint.current.x);
    let y = Math.min(currentY, startPoint.current.y);
    let width = Math.abs(currentX - startPoint.current.x);
    let height = Math.abs(currentY - startPoint.current.y);

    // Clamp to image boundaries
    x = Math.max(0, x);
    y = Math.max(0, y);
    width = Math.min(width, rect.width - x);
    height = Math.min(height, rect.height - y);

    setCrop({
      x,
      y,
      width,
      height,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {imageSrc && (
        <div
          style={{
            position: "relative",
            display: "inline-block",
            marginTop: "20px",
            cursor: "crosshair",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <img
            src={imageSrc}
            alt="Uploaded"
            ref={imageRef}
            style={{ display: "block", maxWidth: "100%", userSelect: "none" }}
          />
          {crop && (
            <div
              style={{
                position: "absolute",
                border: "2px dashed red",
                left: crop.x,
                top: crop.y,
                width: crop.width,
                height: crop.height,
                backgroundColor: "rgba(255, 0, 0, 0.2)",
                pointerEvents: "none",
              }}
            />
          )}
        </div>
      )}
      {crop && (
        <div style={{ marginTop: "10px" }}>
          <strong>Crop Coordinates:</strong>
          <pre>{JSON.stringify(crop, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
