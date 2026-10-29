import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";

// Addresses go to the newsletter_subscribers table; admins see them at /admin.
export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "failed" | "sending" | "done">("idle");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setState("error");
    setState("sending");
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: email.trim().toLowerCase() });
    // 23505: already subscribed, which is fine.
    setState(!error || error.code === "23505" ? "done" : "failed");
  };

  if (state === "done") {
    return (
      <p role="status" className="font-display text-lg font-semibold">
        Subscribed. New work will reach {email} as we add it.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-md">
      <label htmlFor="nl-email" className="ui font-semibold">
        Email address
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id="nl-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setState("idle");
          }}
          placeholder="you@example.com"
          aria-invalid={state === "error"}
          aria-describedby={state === "error" ? "nl-error" : undefined}
          className="ui min-w-0 flex-1 rounded-full border border-ink/25 bg-transparent px-4 py-2.5 placeholder:text-muted"
        />
        <button type="submit" className="btn shrink-0" disabled={state === "sending"}>
          Subscribe
        </button>
      </div>
      {state === "error" && (
        <p id="nl-error" className="ui mt-2 text-violet">
          Enter a full email address, like you@example.com.
        </p>
      )}
      {state === "failed" && (
        <p role="alert" className="ui mt-2 text-violet">
          That didn't go through. Try again in a moment.
        </p>
      )}
    </form>
  );
}
