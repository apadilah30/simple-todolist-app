import type { ReactNode } from "react";

export default function AuthLayout({ children, title = "Login" }: { children: ReactNode, title?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 w-screen">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">{title}</h1>
        {children}
      </div>
    </div>
  );
}