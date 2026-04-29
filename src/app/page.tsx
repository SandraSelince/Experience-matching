"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LangToggle } from "@/components/shared/LangToggle";
import { useLang } from "@/lib/i18n/context";

export default function HomePage() {
  const { t } = useLang();
  const l = t.landing;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-violet-600 flex items-center justify-center text-white text-sm font-bold">EM</div>
            <span className="font-bold text-gray-900 text-lg">Experience Matching</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">{l.howTitle.split("?")[0]}</a>
            <a href="#candidates" className="hover:text-emerald-600 transition-colors">{t.nav.candidates}</a>
            <a href="#companies" className="hover:text-emerald-600 transition-colors">{t.nav.companies}</a>
          </nav>
          <div className="flex items-center gap-2">
            <LangToggle />
            <Link href="/login"><Button variant="outline" size="sm">{t.nav.login}</Button></Link>
            <Link href="/register"><Button size="sm" variant="gradient">{t.nav.start}</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-violet-50 pt-24 pb-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-200 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-violet-200 rounded-full opacity-20 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <Badge className="mb-6 bg-emerald-100 text-emerald-700 border-0 px-4 py-1.5 text-sm">{l.badge}</Badge>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            {l.headline1}{" "}<span className="gradient-text">{l.headline2}</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">{l.sub}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=candidate">
              <Button size="xl" variant="gradient" className="w-full sm:w-auto">{l.ctaCandidate} →</Button>
            </Link>
            <Link href="/register?role=manager">
              <Button size="xl" variant="secondary" className="w-full sm:w-auto">{l.ctaManager}</Button>
            </Link>
          </div>
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[{ value: "70%+", label: l.stat1 }, { value: "3 min", label: l.stat2 }, { value: "100%", label: l.stat3 }].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-extrabold text-emerald-600">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{l.howTitle}</h2>
            <p className="text-gray-500 max-w-xl mx-auto">{l.howSub}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-16">
            <div id="candidates">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl">👤</div>
                <h3 className="text-xl font-bold text-gray-900">{l.forCandidates}</h3>
              </div>
              <div className="space-y-6">
                {l.candidateSteps.map((item, i) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-xs font-bold text-emerald-600">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">{item.title}</div>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/register?role=candidate" className="mt-8 inline-block">
                <Button variant="gradient">{l.ctaCandidateLink}</Button>
              </Link>
            </div>
            <div id="companies">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-xl">🏢</div>
                <h3 className="text-xl font-bold text-gray-900">{l.forManagers}</h3>
              </div>
              <div className="space-y-6">
                {l.managerSteps.map((item, i) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-50 border-2 border-violet-200 flex items-center justify-center text-xs font-bold text-violet-600">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">{item.title}</div>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/register?role=manager" className="mt-8 inline-block">
                <Button variant="secondary">{l.ctaManagerLink}</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-16 bg-gradient-to-br from-emerald-600 to-violet-700 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">{l.trustTitle}</h2>
          <p className="text-emerald-200 mb-10 max-w-2xl mx-auto">{l.trustSub}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[{ icon: "🔒", ...l.trust[0] }, { icon: "🎓", ...l.trust[1] }, { icon: "✋", ...l.trust[2] }, { icon: "🎯", ...l.trust[3] }].map((item) => (
              <Card key={item.title} className="bg-white/10 border-white/20 text-white">
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="font-semibold text-sm mb-1">{item.title}</div>
                  <div className="text-xs text-emerald-200">{item.desc}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{l.ctaFinalTitle}</h2>
          <p className="text-gray-500 mb-8">{l.ctaFinalSub}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=candidate"><Button size="lg" variant="gradient">{l.ctaCandidate}</Button></Link>
            <Link href="/register?role=manager"><Button size="lg" variant="outline">{l.ctaManager}</Button></Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-emerald-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold">EM</div>
            <span className="font-semibold text-gray-700">Experience Matching</span>
          </div>
          <p>© 2025 Experience Matching. {l.footer}</p>
        </div>
      </footer>
    </div>
  );
}
