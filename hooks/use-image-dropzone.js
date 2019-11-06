import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

export default function useImageDropzone(files, setFiles) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    multiple: false,
    onDrop: acceptedFiles => {
      setFiles(
        acceptedFiles.map(file => {
          file.preview = URL.createObjectURL(file);
          return file;
        })
      );
    }
  });

  useEffect(() => {
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  return { getRootProps, getInputProps };
}
