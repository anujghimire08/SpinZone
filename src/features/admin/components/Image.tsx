"use client";

import { buildSrc, Image as ImageKit } from "@imagekit/next";
import { ComponentProps, useEffect, useState } from "react";

type ImageProps = ComponentProps<typeof ImageKit> & {
  fallbackText?: string;
};

const Image = ({ fallbackText, ...props }: ImageProps) => {
  const [hasError, setHasError] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const { alt, className, onError, onLoad, src, style, ...others } = props;

  useEffect(() => {
    setHasError(false);
    setShowPlaceholder(true);
  }, [src]);

  if (!src) {
    setHasError(true);
  }

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-gray-100 text-sm text-gray-500 ${
          props.fill ? "absolute inset-0" : ""
        } ${className ?? ""}`}
        style={{
          ...style,
          ...(!props.fill
            ? {
                width: props.width,
                height: props.height,
              }
            : {}),
        }}
      >
        {fallbackText}
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
      style={{
        ...style,
        // ...(showPlaceholder
        //   ? {
        //       backgroundImage: `url(${buildSrc({
        //         urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
        //         src,
        //         transformation: [
        //           {
        //             quality: 10,
        //             blur: 90,
        //           },
        //         ],
        //       })})`,
        //       backgroundSize: "cover",
        //       backgroundRepeat: "no-repeat",
        //     }
        //   : {}),
      }}
      onLoad={(event) => {
        setShowPlaceholder(false);
        onLoad?.(event);
      }}
    />
  );
};

export default Image;
