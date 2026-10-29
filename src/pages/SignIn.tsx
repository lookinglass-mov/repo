import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { Field, FormError, inputClass, isEmail } from "@/components/Form";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export default function SignIn() {
  const { session } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  if (session) return <Navigate to="/portal" replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isEmail(email)) return setError("Enter a full email address, like you@example.com.");
    setError(null);
    setState("sending");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: `${window.location.origin}/portal` },
    });
    if (error) {
      setState("idle");
      return setError(error.message);
    }
    setState("sent");
  };

  return (
    <div className="page max-w-2xl py-16 sm:py-24">
      <h1 className="text-5xl font-extrabold sm:text-6xl">Client portal</h1>
      {state === "sent" ? (
        <p role="status" className="mt-6 text-xl">
          Check {email} for a sign-in link. It opens your portal in this browser.
        </p>
      ) : (
        <>
          <p className="mt-6 text-xl">
            Enter the email you booked with. We'll send you a link to sign in, no password needed.
          </p>
          <form onSubmit={onSubmit} noValidate className="mt-8 space-y-4">
            <Field id="si-email" label="Email address">
              <input
                id="si-email"
                type="email"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </Field>
            {error && <FormError>{error}</FormError>}
            <button type="submit" className="btn" disabled={state === "sending"}>
              {state === "sending" ? "Sending…" : "Email me a sign-in link"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
