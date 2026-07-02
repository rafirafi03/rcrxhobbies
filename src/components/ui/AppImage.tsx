"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FALLBACK_IMAGE } from "../../lib/images";

interface AppImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  draggable?: boolean;
}

export default function AppImage({
  src,
  alt,
  className = "",
  fill,
  width = 800,
  height = 800,
  priority,
  sizes,
  draggable,
}: AppImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const isRemote = imgSrc.startsWith("http");

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  function handleError() {
    if (imgSrc !== FALLBACK_IMAGE) {
      setImgSrc(FALLBACK_IMAGE);
    }
  }

  const shared = {
    alt,
    className,
    priority,
    sizes,
    unoptimized: isRemote,
    onError: handleError,
    ...(draggable !== undefined ? { draggable } : {}),
  };

  if (fill) {
    return <Image src={imgSrc} fill {...shared} sizes={sizes ?? "100vw"} />;
  }

  return <Image src={imgSrc} width={width} height={height} {...shared} />;
}
