"use client";

import {useRef, useState, type ChangeEvent, type DragEvent} from "react";
import {Camera, RotateCcw, Upload, User} from "lucide-react";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import type {AvatarUploadFieldProps} from "@/app/profile/_types/profile.type";
import NextImage from "next/image";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MiB raw input limit
const TARGET_SIZE = 512; // Output dimensions (512x512px)
const OUTPUT_QUALITY = 0.85;

function resizeAvatarImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const objectUrl = URL.createObjectURL(file);
        const img = new Image();

        img.onload = () => {
            URL.revokeObjectURL(objectUrl);

            const canvas = document.createElement("canvas");
            canvas.width = TARGET_SIZE;
            canvas.height = TARGET_SIZE;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
                reject(new Error("Canvas context unavailable"));
                return;
            }

            const minSide = Math.min(img.width, img.height);
            const sx = (img.width - minSide) / 2;
            const sy = (img.height - minSide) / 2;

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(
                img,
                sx,
                sy,
                minSide,
                minSide,
                0,
                0,
                TARGET_SIZE,
                TARGET_SIZE
            );

            const outputMime =
                file.type === "image/png" ? "image/png" : "image/jpeg";
            resolve(canvas.toDataURL(outputMime, OUTPUT_QUALITY));
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error("Failed to load image"));
        };

        img.src = objectUrl;
    });
}

export function AvatarUploadField({
                                      photo,
                                      initialPhoto = "",
                                      name,
                                      onChange,
                                      disabled = false,
                                  }: AvatarUploadFieldProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const hasChanged = photo !== initialPhoto;

    const processFile = async (file: File) => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            toast.error("Profile photo must be a JPEG, PNG, or WebP image.");
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            toast.error("Profile photo must be 10 MiB or smaller.");
            return;
        }

        try {
            const resizedBase64 = await resizeAvatarImage(file);
            onChange(resizedBase64);
        } catch {
            toast.error("Failed to process the selected photo.");
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) void processFile(file);
        e.target.value = "";
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (disabled) return;

        const file = e.dataTransfer.files?.[0];
        if (file) void processFile(file);
    };

    return (
        <div
            onDragOver={(e) => {
                e.preventDefault();
                if (!disabled) setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex flex-col gap-4 rounded-xl border p-4 transition-colors sm:flex-row sm:items-center sm:justify-between ${
                isDragging
                    ? "border-[#176b50] bg-[#e8f1ec]/60"
                    : "border-[#e5eae5] bg-[#f8faf8]"
            }`}
        >
            <input
                ref={inputRef}
                type="file"
                accept={ALLOWED_TYPES.join(",")}
                onChange={handleFileChange}
                disabled={disabled}
                className="hidden"
            />

            <div className="flex items-center gap-4">
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => inputRef.current?.click()}
                    className="group relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#d3ded5] bg-white transition-all hover:border-[#176b50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176b50]"
                    aria-label="Change profile photo"
                >
                    {photo ? (
                        <NextImage
                            src={photo}
                            alt={name || "Profile preview"}
                            width={64}
                            height={64}
                            unoptimized
                            className="size-full object-cover"
                        />
                    ) : (
                        <User className="size-7 text-[#98a49c]" />
                    )}

                    <span className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
            <Camera className="size-5 text-white" />
          </span>
                </button>

                <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-[#17261f]">Profile Photo</p>
                    <p className="text-xs text-[#6c7d71]">
                        Drag and drop or click to upload. JPEG, PNG, or WebP up to 10 MB
                        (auto-resized to 512×512).
                    </p>
                    {hasChanged && (
                        <p className="text-[11px] font-medium text-[#176b50]">
                            New photo selected — enter current password below to save.
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
                {hasChanged && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={disabled}
                        onClick={() => onChange(initialPhoto)}
                        className="h-9 gap-1.5 rounded-lg text-xs text-[#65766b] hover:bg-[#e8f1ec] hover:text-[#17261f]"
                    >
                        <RotateCcw className="size-3.5" />
                        Undo
                    </Button>
                )}

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={disabled}
                    onClick={() => inputRef.current?.click()}
                    className="h-9 gap-1.5 rounded-lg border-[#d3ded5] bg-white text-xs font-semibold text-[#176b50] hover:bg-[#e8f1ec]"
                >
                    <Upload className="size-3.5" />
                    {photo ? "Change" : "Upload"}
                </Button>
            </div>
        </div>
    );
}