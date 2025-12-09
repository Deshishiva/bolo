import { useRef, useState } from "react";
import { toRelative, toPixels } from "../utils/coordinates";

export default function PdfViewer() {
  const ref = useRef(null);
  const [box, setBox] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleClick(e) {
    const rect = ref.current.getBoundingClientRect();

    const pixelBox = {
      left: e.clientX - rect.left,
      top: e.clientY - rect.top,
      width: 150,
      height: 60
    };

    setBox(
      toRelative(pixelBox, {
        width: rect.width,
        height: rect.height
      })
    );
  }

  async function signPdf() {
    if (!box) return;

    setLoading(true);

    const res = await fetch("http://localhost:5000/api/sign-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        coordinates: box,
        // dummy signature image for now
        signatureBase64:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII="
      })
    });

    const data = await res.json();

    setLoading(false);

    if (data.url) {
      window.open(`http://localhost:5000/${data.url}`, "_blank");
    }
  }

  return (
    <>
      <div
        ref={ref}
        onClick={handleClick}
        style={{
          position: "relative",
          width: 600,
          height: 400,
          margin: "20px auto",
          border: "2px dashed #999",
          background: "#f9f9f9",
          cursor: "crosshair"
        }}
      >
        <p
          style={{
            textAlign: "center",
            color: "#777",
            marginTop: 10
          }}
        >
          Click anywhere to place signature
        </p>

        {box && (
          <div
            style={{
              position: "absolute",
              border: "2px solid blue",
              background: "rgba(0,0,255,0.15)",
              ...toPixels(box, {
                width: ref.current.offsetWidth,
                height: ref.current.offsetHeight
              })
            }}
          />
        )}
      </div>

      {box && (
        <button
          onClick={signPdf}
          disabled={loading}
          style={{
            display: "block",
            margin: "10px auto",
            padding: "8px 16px"
          }}
        >
          {loading ? "Signing..." : "Sign PDF"}
        </button>
      )}
    </>
  );
}
