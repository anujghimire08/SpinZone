import SignoutButton from "@/features/auth/components/SignoutButton";
import { requireAuth } from "@/lib/auth-guard";

const Account = async () => {
  const session = await requireAuth();

  return (
    <div>
      {session.user.name}
      {session.user.email}
      <br />
      <SignoutButton />
    </div>
  );
};

export default Account;
