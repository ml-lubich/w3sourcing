"use client";

import Image, { type ImageProps } from "next/image";
import { useState, type SyntheticEvent } from "react";

type ResilientImageProps = ImageProps & {
  wrapperClassName?: string;
  skeletonClassName?: string;
};

export function ResilientImage({
  wrapperClassName = "relative inline-block overflow-hidden align-middle",
  skeletonClassName = "",
  className = "",
  onLoad,
  onError,
  src,
  alt,
  ...imageProps
}: ResilientImageProps) {
  const [status, setStatus] = useState({ src, isLoaded: false, hasFailed: false });
  const currentStatus = Object.is(status.src, src)
    ? status
    : { src, isLoaded: false, hasFailed: false };

  const showSkeleton = !currentStatus.isLoaded || currentStatus.hasFailed;
  const imageClassName = `${className} transition-opacity duration-300 ${
    showSkeleton ? "opacity-0" : "opacity-100"
  }`.trim();
  const skeletonClasses = `image-load-skeleton absolute inset-0 ${skeletonClassName}`.trim();

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    setStatus({ src, isLoaded: true, hasFailed: false });
    onLoad?.(event);
  };

  const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
    setStatus({ src, isLoaded: false, hasFailed: true });
    onError?.(event);
  };

  return (
    <span className={wrapperClassName}>
      {showSkeleton ? (
        <span aria-hidden="true" data-image-skeleton="" className={skeletonClasses} />
      ) : null}
      <Image
        {...imageProps}
        src={src}
        alt={alt}
        className={imageClassName}
        onLoad={handleLoad}
        onError={handleError}
      />
    </span>
  );
}
