"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLang } from "@/lib/i18n/context";
import { LangToggle } from "@/components/shared/LangToggle";
import { cn } from "@/lib/utils";

interface Job {
  title: string;
  company: string;
  companySize: string;
  industry: string;
  location: string;
  workMode: string;
  seniority: string;
  experienceYears: number;
  salaryMin: number;
  salaryMax: number;
  description: string;
  missions: string[];
  hardSkills: string[];
  softSkills: string[];
  process: string[];
  values: string[];
}

interface Match {
  id: string;
  score: number;
  hardScore: number;
  softScore: number;
  status: string;
  job: Job;
}

const MOCK_MATCHES: Match[] = [
  {
    id: "1",
    score: 94,
    hardScore: 96,
    softScore: 91,
    status: "pending",
    job: {
      title: "Senior Product Designer",
      company: "Acme SaaS",
      companySize: "51-200",
      industry: "Tech / SaaS",
      location: "Paris (Hybride)",
      workMode: "hybrid",
      seniority: "Senior",
      experienceYears: 7,
      salaryMin: 65000,
      salaryMax: 80000,
      description: "Nous cherchons un Product Designer senior pour rejoindre notre équipe produit de 12 personnes. Vous serez responsable de l'expérience globale de notre plateforme B2B SaaS, du design system, et de la collaboration avec nos 3 squads produit.\n\nVous travaillerez directement avec le CPO et les PMs pour définir la vision design à long terme.",
      missions: [
        "Concevoir des interfaces complexes pour notre plateforme B2B SaaS",
        "Maintenir et faire évoluer notre design system (Figma)",
        "Mener des sessions de discovery UX avec les clients",
        "Collaborer quotidiennement avec les équipes engineering",
        "Participer à la stratégie produit globale",
      ],
      hardSkills: ["Figma", "UX Design", "UI Design", "Design System"],
      softSkills: ["Leadership", "Communication", "Créativité"],
      process: ["Call RH (30 min)", "Entretien PM + Designer (1h)", "Case study (3j)", "Culture fit CEO (45 min)"],
      values: ["Innovation", "Impact", "Agilité"],
    },
  },
  {
    id: "2",
    score: 87,
    hardScore: 89,
    softScore: 84,
    status: "pending",
    job: {
      title: "Lead Product Designer",
      company: "FinFlow",
      companySize: "11-50",
      industry: "FinTech",
      location: "Full Remote",
      workMode: "remote",
      seniority: "Lead / Expert",
      experienceYears: 8,
      salaryMin: 70000,
      salaryMax: 90000,
      description: "Rejoignez une FinTech en forte croissance pour diriger la vision design produit d'une application mobile utilisée par 500k utilisateurs en Europe.\n\nPoste stratégique avec un impact direct sur l'expérience de nos clients PME.",
      missions: [
        "Définir la vision design de l'app mobile (iOS / Android)",
        "Manager une équipe de 3 designers",
        "Conduire la recherche utilisateur avec nos clients PME",
        "Collaborer avec les équipes produit et engineering",
        "Présenter la stratégie design au Comité de Direction",
      ],
      hardSkills: ["Figma", "UX Design", "Mobile Design", "Prototypage"],
      softSkills: ["Leadership", "Autonomie", "Orientation résultats"],
      process: ["Call HR (30 min)", "Portfolio review (1h)", "Case study (1 semaine)", "Entretien CEO"],
      values: ["Performance", "Transparence", "Ambition"],
    },
  },
  {
    id: "3",
    score: 78,
    hardScore: 75,
    softScore: 82,
    status: "candidate_accepted",
    job: {
      title: "Product Designer",
      company: "HealthTech Scale-up",
      companySize: "51-200",
      industry: "HealthTech",
      location: "Lyon (Hybride)",
      workMode: "hybrid",
      seniority: "Senior",
      experienceYears: 5,
      salaryMin: 55000,
      salaryMax: 70000,
      description: "Nous développons une plateforme de télémédecine utilisée par 3 000 médecins. Vous travaillerez en étroite collaboration avec des professionnels de santé et des ingénieurs pour créer des interfaces accessibles et conformes.",
      missions: [
        "Concevoir des interfaces pour les médecins et les patients",
        "Garantir l'accessibilité (WCAG AA) des interfaces",
        "Conduire des tests utilisateurs avec des professionnels de santé",
        "Collaborer avec les équipes engineering et réglementaire",
      ],
      hardSkills: ["Figma", "UX Research", "Accessibilité"],
      softSkills: ["Empathie", "Communication", "Travail en équipe"],
      process: ["Call RH (30 min)", "Entretien produit (1h)", "Test pratique (2j)", "Onsite équipe (2h)"],
      values: ["Bienveillance", "Impact", "Excellence"],
    },
  },
  {
    id: "4",
    score: 72,
    hardScore: 70,
    softScore: 75,
    status: "pending",
    job: {
      title: "UX Designer Senior",
      company: "E-commerce Leader",
      companySize: "500+",
      industry: "E-commerce",
      location: "Paris (Présentiel)",
      workMode: "onsite",
      seniority: "Senior",
      experienceYears: 6,
      salaryMin: 58000,
      salaryMax: 72000,
      description: "Rejoignez l'équipe produit d'un e-commerce multi-marques pour repenser l'expérience d'achat sur web et mobile. Vous travaillerez sur un produit utilisé par 10M d'utilisateurs mensuels.",
      missions: [
        "Repenser les parcours d'achat sur web et mobile",
        "Concevoir et analyser des A/B tests",
        "Collaborer avec les équipes data pour affiner les insights",
        "Participer aux sprints de l'équipe produit",
      ],
      hardSkills: ["Figma", "UX Design", "A/B Testing", "Analytics"],
      softSkills: ["Créativité", "Adaptabilité", "Esprit critique"],
      process: ["Call RH (30 min)", "Entretien manager (1h)", "Portfolio review (45 min)", "Onsite (2h)"],
      values: ["Performance", "Innovation", "Diversité"],
    },
  },
];

const getScoreColor = (score: number) => {
  if (score >= 90) return "text-emerald-600";
  if (score >= 75) return "text-violet-600";
  return "text-amber-600";
};

const getScoreBg = (score: number) => {
  if (score >= 90) return "bg-emerald-50 border-emerald-100";
  if (score >= 75) return "bg-violet-50 border-violet-100";
  return "bg-amber-50 border-amber-100";
};

function JobDetailPanel({
  match,
  onClose,
  onAccept,
  onDecline,
}: {
  match: Match;
  onClose: () => void;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}) {
  const { t } = useLang();
  const d = t.candidateDashboard;
  const { job, score, hardScore, softScore, status } = match;
  const workModeLabel = Object.fromEntries(t.onboardingCandidate.workModes.map(({ v, l }) => [v, l]));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl h-full bg-white shadow-2xl overflow-y-auto animate-slide-in">
        <div className="h-28 bg-gradient-to-r from-violet-600 to-indigo-700 flex items-end px-6 pb-4">
          <div className="flex items-end justify-between w-full">
            <div>
              <p className="text-violet-200 text-xs font-medium">{job.company} • {job.industry}</p>
              <h2 className="text-white text-xl font-bold leading-tight mt-0.5">{job.title}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:bg-white/20 transition-all flex-shrink-0 mb-0.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <span>{workModeLabel[job.workMode]}</span>
                <span>•</span>
                <span>{job.location}</span>
                <span>•</span>
                <span>{job.seniority} • {job.experienceYears}+ ans</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success" className="text-xs">Poste ouvert</Badge>
                <Badge variant="secondary" className="text-xs">🏢 {job.companySize} {d.employees}</Badge>
                <Badge variant="secondary" className="text-xs">💰 {(job.salaryMin / 1000).toFixed(0)}-{(job.salaryMax / 1000).toFixed(0)}k€</Badge>
              </div>
            </div>
            <div className={cn("flex-shrink-0 w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center", getScoreBg(score))}>
              <span className={cn("text-xl font-extrabold leading-none", getScoreColor(score))}>{score}%</span>
              <span className="text-xs text-gray-400 mt-0.5">{d.match}</span>
            </div>
          </div>

          <Card className="shadow-none border-gray-100">
            <CardContent className="pt-4 pb-4 space-y-3">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{d.panelMatchDetail}</p>
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>{d.hardSkills}</span>
                  <span className="font-semibold">{hardScore}%</span>
                </div>
                <Progress value={hardScore} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>{d.softSkills}</span>
                  <span className="font-semibold">{softScore}%</span>
                </div>
                <Progress value={softScore} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">{d.panelTitle}</h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">{d.panelMissions}</h3>
            <ul className="space-y-2">
              {job.missions.map((m, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-gray-600">
                  <span className="text-violet-400 flex-shrink-0 mt-0.5">→</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">{d.panelSkills}</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {job.hardSkills.map((s) => <Badge key={s} variant="hard" className="text-sm py-1 px-3">{s}</Badge>)}
            </div>
            <div className="flex flex-wrap gap-2">
              {job.softSkills.map((s) => <Badge key={s} variant="soft" className="text-sm py-1 px-3">{s}</Badge>)}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">{d.panelValues}</h3>
            <div className="flex flex-wrap gap-2">
              {job.values.map((v) => <Badge key={v} variant="default" className="text-xs">{v}</Badge>)}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">{d.panelProcess}</h3>
            <div className="space-y-2">
              {job.process.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-sm text-gray-600">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 pb-4">
            {status === "pending" && (
              <div className="space-y-3">
                <div className="p-4 bg-violet-50 border border-violet-100 rounded-xl">
                  <p className="text-sm text-violet-800 font-semibold mb-1">{d.interested}</p>
                  <p className="text-xs text-violet-600 leading-relaxed">{d.interestedSub}</p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 text-gray-500"
                    onClick={() => { onDecline(match.id); onClose(); }}
                  >
                    {d.notInterested}
                  </Button>
                  <Button
                    variant="success"
                    size="lg"
                    className="flex-2 flex-grow-2"
                    onClick={() => { onAccept(match.id); onClose(); }}
                  >
                    {d.shareProfile}
                  </Button>
                </div>
              </div>
            )}

            {status === "candidate_accepted" && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
                <span className="text-xl flex-shrink-0">✅</span>
                <div>
                  <p className="text-sm font-semibold text-emerald-800">{d.profileSharedTitle}</p>
                  <p className="text-xs text-emerald-700 mt-0.5">{d.profileSharedSub}</p>
                </div>
              </div>
            )}

            {status === "candidate_declined" && (
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl flex items-start gap-3">
                <span className="text-xl flex-shrink-0">↩️</span>
                <div>
                  <p className="text-sm font-semibold text-gray-700">{d.declinedTitle}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{d.declinedSub}</p>
                  <button
                    type="button"
                    className="text-xs text-violet-600 hover:underline mt-1"
                    onClick={() => { onAccept(match.id); onClose(); }}
                  >
                    {d.changeMyMind}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CandidateDashboard() {
  const { t } = useLang();
  const d = t.candidateDashboard;
  const workModeLabel = Object.fromEntries(t.onboardingCandidate.workModes.map(({ v, l }) => [v, l]));

  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES);
  const [activeTab, setActiveTab] = useState<"all" | "accepted" | "declined">("all");
  const [openMatch, setOpenMatch] = useState<Match | null>(null);

  const updateStatus = (id: string, status: string) => {
    setMatches((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    setOpenMatch((prev) => prev && prev.id === id ? { ...prev, status } : prev);
  };

  const filtered = matches.filter((m) => {
    if (activeTab === "accepted") return m.status === "candidate_accepted";
    if (activeTab === "declined") return m.status === "candidate_declined";
    return true;
  });

  const acceptedCount = matches.filter((m) => m.status === "candidate_accepted").length;
  const pendingCount = matches.filter((m) => m.status === "pending").length;
  const avgScore = Math.round(matches.reduce((acc, m) => acc + m.score, 0) / matches.length);

  const liveOpenMatch = openMatch ? matches.find((m) => m.id === openMatch.id) ?? null : null;

  const tabs = [
    { id: "all" as const, label: d.tabs[0] },
    { id: "accepted" as const, label: d.tabs[1] },
    { id: "declined" as const, label: d.tabs[2] },
  ];

  const stats = [
    { label: d.stats[0], value: matches.length, icon: "🎯" },
    { label: d.stats[1], value: `${avgScore}%`, icon: "⚡" },
    { label: d.stats[2], value: pendingCount, icon: "⏳" },
    { label: d.stats[3], value: acceptedCount, icon: "✅" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">EM</div>
            <span className="font-semibold text-gray-800 text-sm">Experience Matching</span>
          </div>
          <div className="flex items-center gap-3">
            <LangToggle />
            <Link href="/candidate/profile/me">
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-sm group-hover:bg-violet-200 transition-colors">MD</div>
                <span className="text-sm text-gray-700 font-medium hidden sm:block group-hover:text-violet-600 transition-colors">Marie Dupont</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{d.hello} Marie 👋</h1>
            <p className="text-gray-500 mt-1">{d.sub}</p>
          </div>
          <Link href="/candidate/profile/me">
            <Button variant="secondary" size="sm">{d.myProfile}</Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="shadow-none border-gray-100">
              <CardContent className="pt-5 pb-4">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-extrabold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === tab.id ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((match) => (
            <Card
              key={match.id}
              className={cn(
                "shadow-none border transition-all cursor-pointer hover:shadow-md hover:border-violet-200 group",
                match.status === "candidate_declined" ? "opacity-60" : "",
                liveOpenMatch?.id === match.id ? "ring-2 ring-violet-400 border-violet-200" : ""
              )}
              onClick={() => setOpenMatch(match)}
            >
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start gap-4">
                  <div className={cn("flex-shrink-0 w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center", getScoreBg(match.score))}>
                    <span className={cn("text-xl font-extrabold leading-none", getScoreColor(match.score))}>{match.score}%</span>
                    <span className="text-xs text-gray-400 mt-0.5">{d.match}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-violet-700 transition-colors">{match.job.title}</h3>
                        <p className="text-sm text-gray-500">{match.job.company} • {match.job.industry}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {match.status === "candidate_accepted" && <Badge variant="success" className="text-xs">{d.shared}</Badge>}
                        {match.status === "candidate_declined" && <Badge variant="secondary" className="text-xs">{d.declined}</Badge>}
                        {match.status === "pending" && <Badge variant="default" className="text-xs">{d.new}</Badge>}
                        <span className="text-gray-300 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all">→</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                      <span className="text-xs text-gray-400">{workModeLabel[match.job.workMode]} • {match.job.location}</span>
                      <span className="text-xs text-gray-400">{match.job.seniority} • {match.job.experienceYears}+ ans</span>
                      <span className="text-xs text-gray-400">{(match.job.salaryMin / 1000).toFixed(0)}-{(match.job.salaryMax / 1000).toFixed(0)}k€</span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1"><span>{d.hardSkills}</span><span className="font-medium">{match.hardScore}%</span></div>
                        <Progress value={match.hardScore} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1"><span>{d.softSkills}</span><span className="font-medium">{match.softScore}%</span></div>
                        <Progress value={match.softScore} className="h-1.5" />
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {match.job.hardSkills.map((s) => <Badge key={s} variant="hard" className="text-xs">{s}</Badge>)}
                      {match.job.softSkills.map((s) => <Badge key={s} variant="soft" className="text-xs">{s}</Badge>)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">🔍</div>
              <p className="font-medium">{d.noMatches}</p>
            </div>
          )}
        </div>
      </div>

      {liveOpenMatch && (
        <JobDetailPanel
          match={liveOpenMatch}
          onClose={() => setOpenMatch(null)}
          onAccept={(id) => updateStatus(id, "candidate_accepted")}
          onDecline={(id) => updateStatus(id, "candidate_declined")}
        />
      )}
    </div>
  );
}
