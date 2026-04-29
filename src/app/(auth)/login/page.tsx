"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLang } from "@/lib/i18n/context";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLang();
  const a = t.auth;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const isManager = email.includes("manager") || email.includes("recruteur");
    router.push(isManager ? "/manager/dashboard" : "/candidate/dashboard");
  };

  return (
    <Card className="w-full max-w-md shadow-xl border-gray-100">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl">{a.loginTitle}</CardTitle>
        <CardDescription>{a.loginSub}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="email">{a.email}</Label>
            <Input
              id="email"
              type="email"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{a.password}</Label>
              <a href="#" className="text-xs text-emerald-600 hover:underline">{a.forgotPassword}</a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={loading}>
            {loading ? a.loggingIn : a.loginCta}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100" />
          </div>
          <div className="relative flex justify-center text-xs text-gray-400 bg-white px-3">{a.or}</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link href="/candidate/dashboard">
            <Button variant="outline" size="sm" className="w-full text-xs">
              {a.demoCandidate}
            </Button>
          </Link>
          <Link href="/manager/dashboard">
            <Button variant="outline" size="sm" className="w-full text-xs">
              {a.demoManager}
            </Button>
          </Link>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          {a.noAccount}{" "}
          <Link href="/register" className="text-emerald-600 font-medium hover:underline">
            {a.signup}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
