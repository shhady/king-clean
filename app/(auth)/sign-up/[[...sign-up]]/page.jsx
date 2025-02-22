import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignUp 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-blue-500 hover:bg-blue-500-dark',
          },
        }}
      />
    </div>
  );
}