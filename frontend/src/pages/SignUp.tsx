import { SignupSection, SelectAvatar } from "@/components/sections";
import { useState } from "react";

const Signup = () => {
  const [isSelectAvatar, setIsSelectAvatar] = useState(false);
  const [signupUserId, setSignupUserId] = useState<string | null>(null);

  return (
    <>
      <SignupSection
        isOpen={isSelectAvatar}
        onSignupSuccess={(userId: string) => {
          setIsSelectAvatar(true);
          setSignupUserId(userId);
        }}
      />
      <SelectAvatar isOpen={isSelectAvatar} userId={signupUserId} />
    </>
  );
};
export default Signup;
