"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n/context";

type Role = "candidate" | "manager";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get("role") as Role) || "candidate";
  const { t } = useLang();
  const a = t.auth;

  const [role, setRole] = useState<Role>(defaultRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    router.push(role === "candidate" ? "/candidate/onboarding" : "/manager/onboarding");
  };

  return (
    <Card className="w-full max-w-md shadow-xl border-gray-100">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl">{a.registerTitle}</CardTitle>
        <CardDescription>{a.registerSub}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {(["candidate", "manager"] as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={cn(
                "p-4 rounded-xl border-2 text-center transition-all",
                role === r
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-100 bg-white hover:border-gray-200"
              )}
            >
              <div className="text-2xl mb-1">{r === "candidate" ? "👤" : "🏢"}</div>
              <div className={cn("text-sm font-semibold", role === r ? "text-emerald-700" : "text-gray-700")}>
                {r === "candidate" ? a.roleCandidate : a.roleManager}
              </div>
            </button>
          ))}
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">{a.name}</Label>
            <Input
              id="name"
              placeholder={role === "candidate" ? "Marie Dupont" : "Jean Martin"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">{a.professionalEmail}</Label>
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
            <Label htmlFor="password">{a.passwordLabel}</Label>
            <Input
              id="password"
              type="password"
              placeholder={a.passwordPlaceholder}
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" variant="gradient" size="lg" className="w-full mt-2" disabled={loading}>
            {loading ? a.creating : a.createCta}
          </Button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          {a.terms}{" "}
          <a href="#" className="text-emerald-600 hover:underline">{a.cgu}</a> {a.and}{" "}
          <a href="#" className="text-emerald-600 hover:underline">{a.privacy}</a>.
        </p>

        <p className="text-center text-sm text-gray-500 mt-4">
          {a.alreadyAccount}{" "}
          <Link href="/login" className="text-emerald-600 font-medium hover:underline">
            {a.connect}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
