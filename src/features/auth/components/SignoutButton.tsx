"use client";

import { useRouter } from "next/navigation";
import { getLogout } from "@/features/auth/client/logout";

const SignoutButton = () => {
  const router = useRouter();
  const signoutHandler = async () => {
    const response = await getLogout();
    if (!response.success) return;
    router.replace("/signin");
    router.refresh();
  };
  return <button onClick={signoutHandler}>Logout</button>;
};

export default SignoutButton;
