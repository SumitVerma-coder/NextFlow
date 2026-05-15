import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f6]">
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <SignUp />
      </div>
    </main>
  );
}