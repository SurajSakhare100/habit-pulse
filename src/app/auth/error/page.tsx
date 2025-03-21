"use client";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = () => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration. Please try again later.";
      case "AccessDenied":
        return "Access denied. You don't have permission to sign in.";
      case "Verification":
        return "The sign in link is no longer valid. It may have been used already or it may have expired.";
      default:
        return "An error occurred during authentication. Please try again.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <Card className="p-8 max-w-sm w-full bg-gray-900 border-gray-800">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Authentication Error</h1>
          <p className="text-gray-400">{getErrorMessage()}</p>
        </div>
        <Button
          className="w-full"
          onClick={() => window.location.href = "/auth/signin"}
        >
          Try Again
        </Button>
      </Card>
    </div>
  );
}
