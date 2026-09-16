import { SignIn } from "@clerk/nextjs";
import { clerkAppearance } from "@/config/clerk-theme";

export default function SignInPage() {
  return (
    <div className="w-full flex flex-col items-center">
      <SignIn appearance={clerkAppearance} />
    </div>
  );
}
