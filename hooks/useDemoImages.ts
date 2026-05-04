"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const MAX_DEMO_IMAGES = 8;

export type DemoImageItem = { id: string; url: string };

function filterImageFiles(files: File[]): File[] {
  return files.filter((f) => f.type.startsWith("image/"));
}

/**
 * URLs objet (blob:) — révoque les URLs retirées ou au démontage.
 */
export function useDemoImages() {
  const [items, setItems] = useState<DemoImageItem[]>([]);
  const prevUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    const nextUrls = items.map((i) => i.url);
    const prev = prevUrlsRef.current;
    prev.forEach((u) => {
      if (!nextUrls.includes(u)) URL.revokeObjectURL(u);
    });
    prevUrlsRef.current = nextUrls;
  }, [items]);

  useEffect(() => {
    return () => {
      prevUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      prevUrlsRef.current = [];
    };
  }, []);

  const addFiles = useCallback((fileList: FileList | File[] | null | undefined): number => {
    if (!fileList || fileList.length === 0) return 0;
    const incoming = filterImageFiles(Array.from(fileList));
    if (incoming.length === 0) return 0;

    let added = 0;
    setItems((prev) => {
      const room = MAX_DEMO_IMAGES - prev.length;
      if (room <= 0) return prev;
      const slice = incoming.slice(0, room);
      added = slice.length;
      return [
        ...prev,
        ...slice.map((f) => ({
          id:
            typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          url: URL.createObjectURL(f),
        })),
      ];
    });
    return added;
  }, []);

  const removeAt = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
  }, []);

  const urls = items.map((i) => i.url);

  return { items, urls, addFiles, removeAt, clearAll };
}
