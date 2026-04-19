import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const quillInstance = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean']
          ]
        }
      });

      quillInstance.current.on('text-change', () => {
        const html = quillInstance.current.root.innerHTML;
        onChange?.(html);
      });
    }
  }, [onChange]); // No 'value' here – we handle value separately

  // Update editor content when value prop changes externally
  useEffect(() => {
    if (quillInstance.current && quillInstance.current.root.innerHTML !== value) {
      quillInstance.current.root.innerHTML = value || '';
    }
  }, [value]); // ✅ Added 'value' dependency

  return <div ref={editorRef} style={{ height: 300 }} />;
};

export default RichTextEditor;