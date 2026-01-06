import { MobileHeader } from "@/components/layout/MobileHeader";
import { strings } from "@/data/strings.ko";

const Profile = () => {
  return (

    <>
      <MobileHeader title={strings.nav.profile} />
      <main className="px-4 py-6">
        <div className="rounded-lg bg-card p-4 text-center text-muted-foreground">
          {strings.common.placeholder}
        </div>
      </main>
    </>
  );
};

export default Profile;
