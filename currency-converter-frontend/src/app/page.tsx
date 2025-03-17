'use client';
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <h1 className="text-2xl font-bold">Welcome to the Currency Converter</h1>
      <Button onClick={handleLogin} className="mt-10 cursor-pointer">
        Login
      </Button>
    </div>
  );
}
