import "quill/dist/quill.snow.css";
import React, { useEffect, useRef } from "react";

let Quill;

export default function RichTextEditor({
  value = "",
  onChange,
  placeholder,
  as = "html", // 👈 use "text" to work with plain text
}) {
  const hostRef = useRef(null);
  const quillRef = useRef(null);
  const onChangeRef = useRef(onChange);
  const applyingExternalValue = useRef(false);

  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (typeof window === "undefined" || quillRef.current || !mounted) return;
      const { default: Q } = await import("quill");
      Quill = Q;

      const q = new Quill(hostRef.current, {
        theme: "snow",
        placeholder,
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }, { font: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["bold", "italic", "underline"],
            ["link", "image"],
          ],
        },
      });

      // Force LTR typing to avoid "backwards" issue
      q.root.setAttribute("dir", "ltr");
      q.format("direction", "ltr");
      q.format("align", "left");

      // Initial content according to mode
      if (value) {
        applyingExternalValue.current = true;
        if (as === "text") {
          q.setText(value);
        } else {
          q.clipboard.dangerouslyPasteHTML(value, "silent");
        }
        applyingExternalValue.current = false;
      }

      const handler = () => {
        if (applyingExternalValue.current) return;
        if (as === "text") {
          // Quill always keeps a trailing "\n"
          const text = q.getText().replace(/\n+$/, "");
          onChangeRef.current?.(text);
        } else {
          onChangeRef.current?.(q.root.innerHTML);
        }
      };
      q.on("text-change", handler);

      quillRef.current = q;
    })();
    return () => { mounted = false; };
  }, [as, placeholder]); // (value is handled below)

  // React to EXTERNAL value changes without loops
  useEffect(() => {
    const q = quillRef.current;
    if (!q) return;
    if (as === "text") {
      const current = q.getText().replace(/\n+$/, "");
      if (current !== (value || "")) {
        applyingExternalValue.current = true;
        q.setText(value || "");
        applyingExternalValue.current = false;
      }
    } else {
      if (q.root.innerHTML !== (value || "")) {
        applyingExternalValue.current = true;
        q.clipboard.dangerouslyPasteHTML(value || "", "silent");
        applyingExternalValue.current = false;
      }
    }
  }, [value, as]);

  return (
    <div className="quill-wrapper" style={{ border: "1px solid #ccc", minHeight: 150, borderRadius: 8 }}>
      <div ref={hostRef} />
    </div>
  );
}
