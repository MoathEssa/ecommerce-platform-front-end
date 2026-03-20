import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { toast } from "sonner";

import { useGoogleLoginMutation } from "@features/auth";
import { firebaseAuth, googleProvider } from "@features/auth/lib/firebase";
import { Button } from "@shared/ui/button";

interface Props {
  mode: "signin" | "signup";
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        d="M21.35 11.1H12v2.98h5.36c-.23 1.48-1.69 4.33-5.36 4.33-3.23 0-5.86-2.68-5.86-5.98s2.63-5.98 5.86-5.98c1.84 0 3.07.78 3.77 1.46l2.58-2.5C16.7 3.88 14.57 3 12 3 7.03 3 3 7.03 3 12s4.03 9 9 9c5.2 0 8.65-3.65 8.65-8.78 0-.59-.06-1.04-.14-1.12Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function GoogleAuthButton({ mode }: Props) {
  const navigate = useNavigate();
  const [googleLogin, { isLoading }] = useGoogleLoginMutation();
  const [isFirebaseLoading, setIsFirebaseLoading] = useState(false);

  async function handleGoogleAuth() {
    try {
      setIsFirebaseLoading(true);
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      const idToken = await result.user.getIdToken();

      await googleLogin({ idToken }).unwrap();
      navigate("/");
    } catch (err: unknown) {
      console.error("[GoogleAuth] error:", err);
      const firebaseCode = (err as { code?: string })?.code;
      const message = (err as { message?: string })?.message;
      console.error("[GoogleAuth] code:", firebaseCode, "message:", message);
      toast.error(`Google authentication failed: ${firebaseCode ?? message ?? "unknown error"}`);
    } finally {
      setIsFirebaseLoading(false);
    }
  }

  const loading = isLoading || isFirebaseLoading;

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleGoogleAuth}
      disabled={loading}
    >
      <GoogleIcon />
      {loading
        ? "Connecting..."
        : mode === "signin"
          ? "Sign in with Google"
          : "Sign up with Google"}
    </Button>
  );
}
