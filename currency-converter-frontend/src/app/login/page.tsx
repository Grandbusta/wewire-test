'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/lib/features/auth/authApi";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ email, password }).unwrap();
      console.log(result);
      if (result.token) {
        localStorage.setItem('token', result.token);
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Failed to login:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center flex-col bg-white dark:bg-gray-900">
      <h1 className="text-2xl font-bold text-black dark:text-white mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-[350px]">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </div>
  );
}