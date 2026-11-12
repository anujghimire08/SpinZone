import { NextResponse } from "next/server";
import { getUploadAuthParams } from "@imagekit/next/server";
import { authorizeAdminAction } from "@/lib/role-guard";

export const GET = async () => {
  const authorization = await authorizeAdminAction();

  if (!authorization.authorized) {
    return NextResponse.json(
      { error: authorization.error ?? "Unauthorized access." },
      { status: 403 },
    );
  }

  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    return NextResponse.json(
      { error: "ImageKit configuration is missing." },
      { status: 500 },
    );
  }

  const { token, expire, signature } = getUploadAuthParams({
    publicKey,
    privateKey,
  });

  return NextResponse.json({
    token,
    expire,
    signature,
    publicKey,
  });
};
