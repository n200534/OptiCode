"use client"; // Add this directive
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="flex items-center justify-between p-2 bg-gray-900 text-white shadow-2xl  shadow-cyan-500/40 rounded-lg">
      <h1
        className="text-2xl font-extrabold cursor-pointer"
        onClick={() => router.push("/")}
      >
        OptiCode
      </h1>
      <Button
        variant="outline"
        className="border-white text-white hover:bg-gray-800 rounded"
      >
        Sign In
      </Button>
    </nav>
  );
}
