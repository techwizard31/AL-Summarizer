"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, X } from "lucide-react";
import type { FileUploadProps } from "../types";

export default function FileUpload({
  onFileContent,
  isLoading,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (selectedFile: File) => {
    // if (!selectedFile) return;
    if (selectedFile.size > 10 * 1024 * 1024) {
      // 10MB limit
      alert("File size must be less than 10MB");
      return;
    }

    setFile(selectedFile);

    const text = await selectedFile.text();
    onFileContent(text);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    onFileContent("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-2 text-purple-300">
        Upload Transcript
      </label>

      {!file ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative border-2 border-dashed p-8 text-center transition-all duration-200
            ${
              isDragging
                ? "border-purple-400 bg-purple-900/20"
                : "border-purple-600/50 hover:border-purple-500 hover:bg-purple-900/10"
            }
            ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
          onClick={() => !isLoading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,text/plain,.pdf,application/pdf"
            onChange={handleFileInput}
            className="hidden"
            disabled={isLoading}
          />

          <Upload className="w-12 h-12 mx-auto mb-4 text-purple-400" />

          <p className="text-lg font-medium mb-2 text-white">
            Drop your transcript file here
          </p>
          <p className="text-sm text-gray-400">or click to browse</p>
          <p className="text-xs text-gray-500 mt-2">
            Supports .txt files up to 10MB
          </p>
        </div>
      ) : (
        <div className="glass-effect rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-purple-400" />
            <div>
              <p className="font-medium text-white">{file.name}</p>
              <p className="text-sm text-gray-400">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>

          {!isLoading && (
            <button
              onClick={removeFile}
              className="p-2 hover:bg-purple-900/30 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
