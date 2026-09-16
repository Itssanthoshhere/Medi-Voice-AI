import { SignUp } from "@clerk/nextjs";
import { clerkAppearance } from "@/config/clerk-theme";

export default function SignUpPage() {
  return (
    <div className="w-full flex flex-col items-center">
      <SignUp appearance={clerkAppearance} />
    </div>
  );
}
