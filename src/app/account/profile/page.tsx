import UpdateProfileForm from "@/features/account/components/UpdateProfileForm";
import { requireAuth } from "@/lib/auth-guard";

const ProfilePage = async () => {
  const session = await requireAuth();

  return <UpdateProfileForm initialName={session.user.name} />;
};

export default ProfilePage;
