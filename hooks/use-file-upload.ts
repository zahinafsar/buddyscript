"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useFileUpload() {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [key, setKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const reset = useCallback(() => {
    xhrRef.current?.abort();
    xhrRef.current = null;
    setProgress(0);
    setIsUploading(false);
    setKey(null);
    setError(null);
  }, []);

  useEffect(() => () => xhrRef.current?.abort(), []);

  const upload = useCallback(
    (file: File) => {
      reset();
      setIsUploading(true);

      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        setIsUploading(false);
        try {
          const data = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300 && data.key) {
            setProgress(100);
            setKey(data.key);
          } else {
            setError(data.error ?? "Image upload failed.");
          }
        } catch {
          setError("Image upload failed.");
        }
      };

      xhr.onerror = () => {
        setIsUploading(false);
        setError("Image upload failed.");
      };

      xhr.open("POST", "/api/upload");
      const formData = new FormData();
      formData.append("file", file);
      xhr.send(formData);
    },
    [reset]
  );

  return { upload, reset, progress, isUploading, key, error };
}
