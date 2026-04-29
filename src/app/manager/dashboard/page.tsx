"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLang } from "@/lib/i18n/context";
import { LangToggle } from "@/components/shared/LangToggle";
import { cn } from "@/lib/utils";

const MOCK_JOBS = [
  {
    id: "j1",
    title: "Senior Product Designer",
    seniority: "Senior",
    experienceYears: 7,
    workMode: "hybrid",
    location: "Paris (Hybride)",
    status: "open",
    hardSkills: ["Figma", "UX Design", "UI Design", "Design System"],
    softSkills: ["Leadership", "Communication", "Créativité"],
    matchCount: 4,
    newCount: 2,
  },
  {
    id: "j2",
    title: "Product Manager B2B SaaS",
    seniority: "Mid",
    experienceYears: 4,
    workMode: "hybrid",
    location: "Paris (Hybride)",
    status: "open",
    hardSkills: ["Product Management", "Agile/Scrum", "SQL", "Jira"],
    softSkills: ["Communication", "Leadership", "Orientation résultats"],
    matchCount: 7,
    newCount: 3,
  },
];

const MOCK_CANDIDATES = [
  {
    id: "c1",
    jobId: "j1",
    score: 94,
    hardScore: 96,
    softScore: 91,
    roleFit: 96,
    cultureFit: 92,
    practicalFit: 94,
    status: "pending_review",
    name: "Marie D.",
    title: "Senior Product Designer",
    seniority: "Senior (5-8 ans)",
    location: "Paris",
    workMode: "hybrid",
    hardSkills: ["Figma", "UX Design", "UI Design", "Design System", "Prototypage"],
    softSkills: ["Leadership", "Communication", "Créativité", "Empathie"],
    strengths: "Créativité, Résolution de problèmes",
    workStyle: "Autonome & orienté impact",
    whyMatch: [
      "Son expérience en design system correspond exactement aux exigences du poste",
      "Son style de travail autonome s'aligne avec la culture de l'équipe produit",
      "Localisation Paris — aucune contrainte logistique pour le mode hybride",
      "Ses ambitions de croissance correspondent aux opportunités offertes",
    ],
    risks: [
      "Attentes salariales potentiellement au-delà de la fourchette haute",
      "Profil très senior, pourrait s'ennuyer sur des tâches d'exécution",
    ],
  },
  {
    id: "c2",
    jobId: "j1",
    score: 87,
    hardScore: 89,
    softScore: 84,
    roleFit: 88,
    cultureFit: 83,
    practicalFit: 90,
    status: "pending_review",
    name: "Lucas M.",
    title: "Lead UX Designer",
    seniority: "Expert (8+ ans)",
    location: "Lyon",
    workMode: "remote",
    hardSkills: ["Figma", "UX Design", "UI Design", "UX Research"],
    softSkills: ["Leadership", "Autonomie", "Esprit critique"],
    strengths: "Leadership, Analyse",
    workStyle: "Structuré & orienté data",
    whyMatch: [
      "Expertise UX Research rare et très recherchée pour ce poste",
      "Expérience leadership — capable de monter en responsabilité rapidement",
      "Disponible full remote, flexibilité géographique appréciée",
    ],
    risks: [
      "Basé à Lyon — présentiel occasionnel pourrait poser problème",
      "Profil plus senior que requis, risque de surqualification",
      "Style très structuré peut entrer en tension avec un environnement agile rapide",
    ],
  },
  {
    id: "c3",
    jobId: "j1",
    score: 78,
    hardScore: 75,
    softScore: 82,
    roleFit: 74,
    cultureFit: 85,
    practicalFit: 78,
    status: "hired",
    name: "Sophie K.",
    title: "Product Designer",
    seniority: "Senior (5-8 ans)",
    location: "Paris",
    workMode: "hybrid",
    hardSkills: ["Figma", "UX Design", "UI Design"],
    softSkills: ["Travail en équipe", "Communication", "Adaptabilité"],
    strengths: "Collaboration, Créativité",
    workStyle: "Collaboratif & bienveillant",
    whyMatch: [
      "Excellent culture fit avec les valeurs de bienveillance de l'équipe",
      "Profil Paris hybride — aucune contrainte logistique",
      "Forte capacité d'adaptation dans des contextes changeants",
    ],
    risks: [
      "Compétences design system à renforcer (manque Prototypage avancé)",
      "Moins d'expérience en B2B SaaS que les autres candidats",
    ],
  },
  {
    id: "c4",
    jobId: "j2",
    score: 91,
    hardScore: 93,
    softScore: 88,
    roleFit: 93,
    cultureFit: 89,
    practicalFit: 91,
    status: "pending_review",
    name: "Thomas B.",
    title: "Senior Product Manager",
    seniority: "Mid (2-5 ans)",
    location: "Paris",
    workMode: "hybrid",
    hardSkills: ["Product Management", "Agile/Scrum", "SQL", "Jira", "Analytics"],
    softSkills: ["Communication", "Leadership", "Orientation résultats"],
    strengths: "Data-driven, Leadership",
    workStyle: "Orienté résultats & structuré",
    whyMatch: [
      "Maîtrise SQL et Analytics — répond parfaitement aux besoins de la squad Growth",
      "Style orienté résultats aligné avec la culture de performance de l'équipe",
      "Expérience Agile/Scrum solide pour piloter les sprints en autonomie",
      "Paris hybride — disponibilité immédiate",
    ],
    risks: [
      "Expérience mid level, pourrait manquer de recul sur des décisions stratégiques",
    ],
  },
  {
    id: "c5",
    jobId: "j2",
    score: 83,
    hardScore: 80,
    softScore: 87,
    roleFit: 79,
    cultureFit: 90,
    practicalFit: 82,
    status: "pending_review",
    name: "Amina R.",
    title: "Product Manager",
    seniority: "Mid (2-5 ans)",
    location: "Paris",
    workMode: "remote",
    hardSkills: ["Product Management", "Agile/Scrum", "Jira"],
    softSkills: ["Communication", "Empathie", "Adaptabilité"],
    strengths: "Empathie, Communication",
    workStyle: "Centré utilisateur & collaboratif",
    whyMatch: [
      "Excellent culture fit — profil centré utilisateur correspond aux valeurs produit",
      "Très forte capacité de communication, essentielle pour aligner les parties prenantes",
      "Grande adaptabilité dans des environnements en forte croissance",
    ],
    risks: [
      "Pas de compétences SQL déclarées — gap sur la partie data analytics",
      "Préférence remote peut limiter la collaboration spontanée avec l'équipe",
    ],
  },
];

const getScoreColor = (score: number) => {
  if (score >= 90) return "text-emerald-600";
  if (score >= 75) return "text-violet-600";
  return "text-amber-600";
};

const getScoreBg = (score: number) => {
  if (score >= 90) return "bg-emerald-50 border-emerald-200";
  if (score >= 75) return "bg-violet-50 border-violet-200";
  return "bg-amber-50 border-amber-200";
};

export default function ManagerDashboard() {
  const router = useRouter();
  const { t } = useLang();
  const d = t.managerDashboard;

  const [selectedJob, setSelectedJob] = useState("j1");
  const [candidates, setCandidates] = useState(MOCK_CANDIDATES);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);

  const jobCandidates = candidates.filter((c) => c.jobId === selectedJob);
  const selectedJob_ = MOCK_JOBS.find((j) => j.id === selectedJob);

  const updateCandidateStatus = (id: string, status: string) => {
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    setSelectedCandidate(null);
  };

  const totalMatches = candidates.length;
  const pendingReview = candidates.filter((c) => c.status === "pending_review").length;
  const hired = candidates.filter((c) => c.status === "hired").length;

  const stats = [
    { label: d.stats[0], value: MOCK_JOBS.length, icon: "📋" },
    { label: d.stats[1], value: totalMatches, icon: "👥" },
    { label: d.stats[2], value: pendingReview, icon: "⏳" },
    { label: d.stats[3], value: hired, icon: "🎉" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">EM</div>
            <span className="font-semibold text-gray-800 text-sm">Experience Matching</span>
            <Badge variant="secondary" className="text-xs ml-1">{d.recruiterBadge}</Badge>
          </div>
          <div className="flex items-center gap-3">
            <LangToggle />
            <Link href="/manager/onboarding">
              <Button variant="gradient" size="sm">{d.createJob}</Button>
            </Link>
            <Link href="/manager/company/me">
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm group-hover:bg-indigo-200 transition-colors">JM</div>
                <span className="text-sm text-gray-700 font-medium hidden sm:block group-hover:text-indigo-600 transition-colors">{t.nav.myCompany}</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{d.hello} Jean 👋</h1>
            <p className="text-gray-500 mt-1">{d.sub}</p>
          </div>
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

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-3">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">{d.openJobs}</h2>
            {MOCK_JOBS.map((job) => (
              <button
                key={job.id}
                type="button"
                onClick={() => setSelectedJob(job.id)}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all",
                  selectedJob === job.id ? "border-violet-500 bg-violet-50 shadow-sm" : "border-gray-100 bg-white hover:border-violet-200"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={cn("font-semibold text-sm", selectedJob === job.id ? "text-violet-700" : "text-gray-900")}>
                      {job.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{job.seniority} • {job.experienceYears}+ ans</p>
                  </div>
                  {job.newCount > 0 && (
                    <span className="flex-shrink-0 bg-violet-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {job.newCount} {d.newBadge}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant={job.status === "open" ? "success" : "secondary"} className="text-xs">
                    {job.status === "open" ? d.open : d.closed}
                  </Badge>
                  <span className="text-xs text-gray-400">{job.matchCount} {d.matches}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {job.hardSkills.slice(0, 3).map((s) => <Badge key={s} variant="hard" className="text-xs">{s}</Badge>)}
                </div>
              </button>
            ))}

            <Link href="/manager/onboarding">
              <Button variant="outline" size="sm" className="w-full mt-2">
                {d.createJob}
              </Button>
            </Link>
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700">
                {d.matchedProfiles} — {selectedJob_?.title}
              </h2>
              <span className="text-xs text-gray-400">{jobCandidates.length} {d.profiles}</span>
            </div>

            <div className="space-y-3">
              {jobCandidates.map((candidate) => (
                <Card
                  key={candidate.id}
                  className={cn(
                    "shadow-none border cursor-pointer transition-all hover:shadow-md",
                    candidate.status === "rejected" ? "opacity-50" : "",
                    selectedCandidate === candidate.id ? "ring-2 ring-violet-400" : ""
                  )}
                  onClick={() => setSelectedCandidate(selectedCandidate === candidate.id ? null : candidate.id)}
                >
                  <CardContent className="pt-4 pb-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                        {candidate.name[0]}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); router.push(`/candidate/profile/${candidate.id}`); }}
                              className="font-bold text-gray-900 hover:text-violet-600 hover:underline transition-colors"
                            >
                              {candidate.name}
                            </button>
                            <span className="text-sm text-gray-500 ml-1.5">• {candidate.title}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className={cn("px-2.5 py-1 rounded-lg border text-sm font-extrabold", getScoreBg(candidate.score))}>
                              <span className={getScoreColor(candidate.score)}>{candidate.score}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-400">{candidate.seniority}</span>
                          <span className="text-xs text-gray-400">{candidate.location}</span>
                          {candidate.status === "hired" && <Badge variant="success" className="text-xs">{d.hired}</Badge>}
                          {candidate.status === "rejected" && <Badge variant="destructive" className="text-xs">{d.rejected}</Badge>}
                        </div>

                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <div>
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>{t.managerDashboard.hardSkills}</span><span>{candidate.hardScore}%</span>
                            </div>
                            <Progress value={candidate.hardScore} className="h-1" />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>{t.managerDashboard.softSkills}</span><span>{candidate.softScore}%</span>
                            </div>
                            <Progress value={candidate.softScore} className="h-1" />
                          </div>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-1">
                          {candidate.hardSkills.slice(0, 3).map((s) => <Badge key={s} variant="hard" className="text-xs">{s}</Badge>)}
                          {candidate.softSkills.slice(0, 2).map((s) => <Badge key={s} variant="soft" className="text-xs">{s}</Badge>)}
                        </div>
                      </div>
                    </div>

                    {selectedCandidate === candidate.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in-up space-y-4">

                        {/* ── MATCH BREAKDOWN ── */}
                        <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/40 border border-indigo-100 p-4">
                          <div className="flex items-start justify-between mb-1">
                            <div>
                              <p className="font-bold text-gray-900 text-sm">{d.matchBreakdown}</p>
                              <p className="flex items-center gap-1 text-xs text-indigo-500 mt-0.5">
                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                                {d.aiPowered}
                              </p>
                            </div>
                            <span className={cn("text-3xl font-extrabold", getScoreColor(candidate.score))}>{candidate.score}%</span>
                          </div>

                          <div className="space-y-3 mt-4">
                            {[
                              { label: d.roleFit, value: candidate.roleFit, color: "bg-blue-500" },
                              { label: d.cultureFit, value: candidate.cultureFit, color: "bg-violet-500" },
                              { label: d.practicalFit, value: candidate.practicalFit, color: "bg-emerald-500" },
                            ].map((row) => (
                              <div key={row.label}>
                                <div className="flex justify-between text-sm mb-1.5">
                                  <span className="text-gray-600 font-medium">{row.label}</span>
                                  <span className="font-bold text-gray-900">{row.value}%</span>
                                </div>
                                <div className="h-2 bg-white rounded-full overflow-hidden shadow-inner">
                                  <div className={cn("h-full rounded-full transition-all duration-700", row.color)} style={{ width: `${row.value}%` }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* ── WHY IT WORKS ── */}
                        <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
                          <p className="flex items-center gap-2 font-bold text-emerald-800 text-sm mb-3">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                            {d.whyMatch}
                          </p>
                          <ul className="space-y-1.5">
                            {candidate.whyMatch.map((point, i) => (
                              <li key={i} className="flex gap-2 text-sm text-emerald-900">
                                <span className="text-emerald-400 mt-0.5 shrink-0">•</span>
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* ── RISKS ── */}
                        {candidate.risks.length > 0 && (
                          <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4">
                            <p className="flex items-center gap-2 font-bold text-amber-800 text-sm mb-3">
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                              {d.potentialRisks}
                            </p>
                            <ul className="space-y-1.5">
                              {candidate.risks.map((risk, i) => (
                                <li key={i} className="flex gap-2 text-sm text-amber-900">
                                  <span className="text-amber-400 mt-0.5 shrink-0">•</span>
                                  {risk}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* ── COMPÉTENCES & PROFIL PSY ── */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-violet-50 rounded-xl">
                            <p className="text-xs text-gray-500 mb-1">{d.strengths}</p>
                            <p className="text-sm font-semibold text-violet-800">{candidate.strengths}</p>
                          </div>
                          <div className="p-3 bg-indigo-50 rounded-xl">
                            <p className="text-xs text-gray-500 mb-1">{d.workStyle}</p>
                            <p className="text-sm font-semibold text-indigo-800">{candidate.workStyle}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 mb-2">{d.allSkills}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {candidate.hardSkills.map((s) => <Badge key={s} variant="hard" className="text-xs">{s}</Badge>)}
                            {candidate.softSkills.map((s) => <Badge key={s} variant="soft" className="text-xs">{s}</Badge>)}
                          </div>
                        </div>

                        <Link
                          href={`/candidate/profile/${candidate.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="block w-full text-center text-sm text-violet-600 font-medium hover:underline"
                        >
                          {d.viewFullProfile}
                        </Link>

                        {candidate.status === "pending_review" && (
                          <div className="flex gap-3">
                            <Button variant="outline" size="sm"
                              onClick={(e) => { e.stopPropagation(); updateCandidateStatus(candidate.id, "rejected"); }}
                              className="flex-1 text-gray-500">
                              {d.notRetained}
                            </Button>
                            <Button variant="success" size="sm"
                              onClick={(e) => { e.stopPropagation(); updateCandidateStatus(candidate.id, "hired"); }}
                              className="flex-2 flex-grow-2">
                              {d.retain}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {jobCandidates.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="font-medium">{d.noProfiles}</p>
                  <p className="text-xs mt-1">{d.scanning}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
