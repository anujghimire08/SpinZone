"use client";

import { Image as ImageKit } from "@imagekit/next";
import { ComponentProps, useEffect, useState } from "react";

type ImageProps = ComponentProps<typeof ImageKit>;

const Image = (props: ImageProps) => {
  const [hasError, setHasError] = useState(false);

  const { alt, className, onError, src, ...others } = props;

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-gray-100 text-sm text-gray-500 ${
          props.fill ? "absolute inset-0" : ""
        } ${className ?? ""}`}
      >
        Image unavailable
      </div>
    );
  }

  return (
    <ImageKit
      src={src}
      alt={alt}
      className={className}
      onError={(event) => {
        setHasError(true);
        onError?.(event);
      }}
      {...others}
    />
  );
};

export default Image;
