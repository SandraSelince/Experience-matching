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

type B<T = string> = { fr: T; en: T };
const pick = <T,>(b: B<T>, lang: "fr" | "en"): T => b[lang];

interface Job {
  title: string;
  company: string;
  companySize: string;
  industry: string;
  location: B;
  workMode: string;
  seniority: string;
  experienceYears: number;
  salaryMin: number;
  salaryMax: number;
  description: B;
  missions: B<string[]>;
  hardSkills: string[];
  softSkills: B<string[]>;
  process: B<string[]>;
  values: B<string[]>;
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
      location: { fr: "Paris (Hybride)", en: "Paris (Hybrid)" },
      workMode: "hybrid",
      seniority: "Senior",
      experienceYears: 7,
      salaryMin: 65000,
      salaryMax: 80000,
      description: {
        fr: "Nous cherchons un Product Designer senior pour rejoindre notre équipe produit de 12 personnes. Vous serez responsable de l'expérience globale de notre plateforme B2B SaaS, du design system, et de la collaboration avec nos 3 squads produit.\n\nVous travaillerez directement avec le CPO et les PMs pour définir la vision design à long terme.",
        en: "We are looking for a Senior Product Designer to join our 12-person product team. You will own the overall experience of our B2B SaaS platform, the design system, and collaboration across our 3 product squads.\n\nYou will work directly with the CPO and PMs to define the long-term design vision.",
      },
      missions: {
        fr: [
          "Concevoir des interfaces complexes pour notre plateforme B2B SaaS",
          "Maintenir et faire évoluer notre design system (Figma)",
          "Mener des sessions de discovery UX avec les clients",
          "Collaborer quotidiennement avec les équipes engineering",
          "Participer à la stratégie produit globale",
        ],
        en: [
          "Design complex interfaces for our B2B SaaS platform",
          "Maintain and evolve our design system (Figma)",
          "Run UX discovery sessions with customers",
          "Collaborate daily with engineering teams",
          "Contribute to the overall product strategy",
        ],
      },
      hardSkills: ["Figma", "UX Design", "UI Design", "Design System"],
      softSkills: { fr: ["Leadership", "Communication", "Créativité"], en: ["Leadership", "Communication", "Creativity"] },
      process: {
        fr: ["Call RH (30 min)", "Entretien PM + Designer (1h)", "Case study (3j)", "Culture fit CEO (45 min)"],
        en: ["HR Call (30 min)", "PM + Designer Interview (1h)", "Case study (3d)", "Culture fit CEO (45 min)"],
      },
      values: { fr: ["Innovation", "Impact", "Agilité"], en: ["Innovation", "Impact", "Agility"] },
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
      location: { fr: "Full Remote", en: "Full Remote" },
      workMode: "remote",
      seniority: "Lead / Expert",
      experienceYears: 8,
      salaryMin: 70000,
      salaryMax: 90000,
      description: {
        fr: "Rejoignez une FinTech en forte croissance pour diriger la vision design produit d'une application mobile utilisée par 500k utilisateurs en Europe.\n\nPoste stratégique avec un impact direct sur l'expérience de nos clients PME.",
        en: "Join a fast-growing FinTech to lead the product design vision for a mobile app used by 500k users across Europe.\n\nStrategic role with direct impact on the experience of our SMB customers.",
      },
      missions: {
        fr: [
          "Définir la vision design de l'app mobile (iOS / Android)",
          "Manager une équipe de 3 designers",
          "Conduire la recherche utilisateur avec nos clients PME",
          "Collaborer avec les équipes produit et engineering",
          "Présenter la stratégie design au Comité de Direction",
        ],
        en: [
          "Define the mobile app design vision (iOS / Android)",
          "Manage a team of 3 designers",
          "Lead user research with our SMB customers",
          "Collaborate with product and engineering teams",
          "Present the design strategy to the Executive Committee",
        ],
      },
      hardSkills: ["Figma", "UX Design", "Mobile Design", "Prototyping"],
      softSkills: { fr: ["Leadership", "Autonomie", "Orientation résultats"], en: ["Leadership", "Autonomy", "Results-oriented"] },
      process: {
        fr: ["Call HR (30 min)", "Portfolio review (1h)", "Case study (1 semaine)", "Entretien CEO"],
        en: ["HR Call (30 min)", "Portfolio review (1h)", "Case study (1 week)", "CEO Interview"],
      },
      values: { fr: ["Performance", "Transparence", "Ambition"], en: ["Performance", "Transparency", "Ambition"] },
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
      location: { fr: "Lyon (Hybride)", en: "Lyon (Hybrid)" },
      workMode: "hybrid",
      seniority: "Senior",
      experienceYears: 5,
      salaryMin: 55000,
      salaryMax: 70000,
      description: {
        fr: "Nous développons une plateforme de télémédecine utilisée par 3 000 médecins. Vous travaillerez en étroite collaboration avec des professionnels de santé et des ingénieurs pour créer des interfaces accessibles et conformes.",
        en: "We are building a telemedicine platform used by 3,000 doctors. You will work closely with healthcare professionals and engineers to create accessible, compliant interfaces.",
      },
      missions: {
        fr: [
          "Concevoir des interfaces pour les médecins et les patients",
          "Garantir l'accessibilité (WCAG AA) des interfaces",
          "Conduire des tests utilisateurs avec des professionnels de santé",
          "Collaborer avec les équipes engineering et réglementaire",
        ],
        en: [
          "Design interfaces for doctors and patients",
          "Ensure interface accessibility (WCAG AA)",
          "Run user tests with healthcare professionals",
          "Collaborate with engineering and regulatory teams",
        ],
      },
      hardSkills: ["Figma", "UX Research", "Accessibility"],
      softSkills: { fr: ["Empathie", "Communication", "Travail en équipe"], en: ["Empathy", "Communication", "Teamwork"] },
      process: {
        fr: ["Call RH (30 min)", "Entretien produit (1h)", "Test pratique (2j)", "Onsite équipe (2h)"],
        en: ["HR Call (30 min)", "Product Interview (1h)", "Practical test (2d)", "Team onsite (2h)"],
      },
      values: { fr: ["Bienveillance", "Impact", "Excellence"], en: ["Kindness", "Impact", "Excellence"] },
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
      location: { fr: "Paris (Présentiel)", en: "Paris (On-site)" },
      workMode: "onsite",
      seniority: "Senior",
      experienceYears: 6,
      salaryMin: 58000,
      salaryMax: 72000,
      description: {
        fr: "Rejoignez l'équipe produit d'un e-commerce multi-marques pour repenser l'expérience d'achat sur web et mobile. Vous travaillerez sur un produit utilisé par 10M d'utilisateurs mensuels.",
        en: "Join the product team of a multi-brand e-commerce to rethink the shopping experience on web and mobile. You will work on a product used by 10M monthly users.",
      },
      missions: {
        fr: [
          "Repenser les parcours d'achat sur web et mobile",
          "Concevoir et analyser des A/B tests",
          "Collaborer avec les équipes data pour affiner les insights",
          "Participer aux sprints de l'équipe produit",
        ],
        en: [
          "Rethink shopping journeys on web and mobile",
          "Design and analyse A/B tests",
          "Collaborate with data teams to sharpen insights",
          "Participate in product team sprints",
        ],
      },
      hardSkills: ["Figma", "UX Design", "A/B Testing", "Analytics"],
      softSkills: { fr: ["Créativité", "Adaptabilité", "Esprit critique"], en: ["Creativity", "Adaptability", "Critical thinking"] },
      process: {
        fr: ["Call RH (30 min)", "Entretien manager (1h)", "Portfolio review (45 min)", "Onsite (2h)"],
        en: ["HR Call (30 min)", "Manager interview (1h)", "Portfolio review (45 min)", "Onsite (2h)"],
      },
      values: { fr: ["Performance", "Innovation", "Diversité"], en: ["Performance", "Innovation", "Diversity"] },
    },
  },
];

const getScoreColor = (score: number) => {
  if (score >= 90) return "text-emerald-600";
  if (score >= 75) return "text-emerald-600";
  return "text-amber-600";
};

const getScoreBg = (score: number) => {
  if (score >= 90) return "bg-emerald-50 border-emerald-100";
  if (score >= 75) return "bg-emerald-50 border-emerald-100";
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
  const { t, lang } = useLang();
  const d = t.candidateDashboard;
  const { job, score, hardScore, softScore, status } = match;
  const workModeLabel = Object.fromEntries(t.onboardingCandidate.workModes.map(({ v, l }) => [v, l]));
  const yrs = lang === "en" ? "yrs" : "ans";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl h-full bg-white shadow-2xl overflow-y-auto animate-slide-in">
        <div className="h-28 bg-gradient-to-r from-emerald-600 to-violet-700 flex items-end px-6 pb-4">
          <div className="flex items-end justify-between w-full">
            <div>
              <p className="text-emerald-200 text-xs font-medium">{job.company} • {job.industry}</p>
              <h2 className="text-white text-xl font-bold leading-tight mt-0.5">{job.title}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={lang === "en" ? "Close" : "Fermer"}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:bg-white/20 transition-all flex-shrink-0 mb-0.5 cursor-pointer"
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
                <span>{pick(job.location, lang)}</span>
                <span>•</span>
                <span>{job.seniority} • {job.experienceYears}+ {yrs}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success" className="text-xs">{lang === "en" ? "Open position" : "Poste ouvert"}</Badge>
                <Badge variant="secondary" className="text-xs">{job.companySize} {d.employees}</Badge>
                <Badge variant="secondary" className="text-xs">{(job.salaryMin / 1000).toFixed(0)}–{(job.salaryMax / 1000).toFixed(0)}k€</Badge>
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
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{pick(job.description, lang)}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">{d.panelMissions}</h3>
            <ul className="space-y-2">
              {pick(job.missions, lang).map((m, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-gray-600">
                  <span className="text-emerald-400 flex-shrink-0 mt-0.5">→</span>
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
              {pick(job.softSkills, lang).map((s) => <Badge key={s} variant="soft" className="text-sm py-1 px-3">{s}</Badge>)}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">{d.panelValues}</h3>
            <div className="flex flex-wrap gap-2">
              {pick(job.values, lang).map((v) => <Badge key={v} variant="default" className="text-xs">{v}</Badge>)}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">{d.panelProcess}</h3>
            <div className="space-y-2">
              {pick(job.process, lang).map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
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
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <p className="text-sm text-emerald-800 font-semibold mb-1">{d.interested}</p>
                  <p className="text-xs text-emerald-600 leading-relaxed">{d.interestedSub}</p>
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
                <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <div>
                  <p className="text-sm font-semibold text-emerald-800">{d.profileSharedTitle}</p>
                  <p className="text-xs text-emerald-700 mt-0.5">{d.profileSharedSub}</p>
                </div>
              </div>
            )}

            {status === "candidate_declined" && (
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.63"/></svg>
                <div>
                  <p className="text-sm font-semibold text-gray-700">{d.declinedTitle}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{d.declinedSub}</p>
                  <button
                    type="button"
                    className="text-xs text-emerald-600 hover:underline mt-1"
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
  const { t, lang } = useLang();
  const d = t.candidateDashboard;
  const workModeLabel = Object.fromEntries(t.onboardingCandidate.workModes.map(({ v, l }) => [v, l]));
  const yrs = lang === "en" ? "yrs" : "ans";

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
    { label: d.stats[0], value: matches.length, icon: (
      <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
    )},
    { label: d.stats[1], value: `${avgScore}%`, icon: (
      <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
    )},
    { label: d.stats[2], value: pendingCount, icon: (
      <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    )},
    { label: d.stats[3], value: acceptedCount, icon: (
      <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    )},
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-gradient-to-br from-emerald-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold">EM</div>
            <span className="font-semibold text-gray-800 text-sm">Experience Matching</span>
          </div>
          <div className="flex items-center gap-3">
            <LangToggle />
            <Link href="/candidate/profile/me">
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm group-hover:bg-emerald-200 transition-colors">MD</div>
                <span className="text-sm text-gray-700 font-medium hidden sm:block group-hover:text-emerald-600 transition-colors">Marie Dupont</span>
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
                <div className="mb-2">{stat.icon}</div>
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
                "shadow-none border transition-all cursor-pointer hover:shadow-md hover:border-emerald-200 group",
                match.status === "candidate_declined" ? "opacity-60" : "",
                liveOpenMatch?.id === match.id ? "shadow-md" : ""
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
                        <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{match.job.title}</h3>
                        <p className="text-sm text-gray-500">{match.job.company} • {match.job.industry}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {match.status === "candidate_accepted" && <Badge variant="success" className="text-xs">{d.shared}</Badge>}
                        {match.status === "candidate_declined" && <Badge variant="secondary" className="text-xs">{d.declined}</Badge>}
                        {match.status === "pending" && <Badge variant="default" className="text-xs">{d.new}</Badge>}
                        <span className="text-gray-300 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all">→</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                      <span className="text-xs text-gray-400">{workModeLabel[match.job.workMode]} • {pick(match.job.location, lang)}</span>
                      <span className="text-xs text-gray-400">{match.job.seniority} • {match.job.experienceYears}+ {yrs}</span>
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
                      {pick(match.job.softSkills, lang).map((s) => <Badge key={s} variant="soft" className="text-xs">{s}</Badge>)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <div className="flex justify-center mb-3">
                <svg className="w-10 h-10 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
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
