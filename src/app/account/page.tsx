import { requireAuth } from "@/lib/auth-guard";

const Account = async () => {
  const session = await requireAuth();

  return (
    <div>
      {session.user.name}
      {session.user.email}
      <br />
    </div>
  );
};

export default Account;
