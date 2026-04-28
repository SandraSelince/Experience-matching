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
  },
  {
    id: "c2",
    jobId: "j1",
    score: 87,
    hardScore: 89,
    softScore: 84,
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
  },
  {
    id: "c3",
    jobId: "j1",
    score: 78,
    hardScore: 75,
    softScore: 82,
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
  },
  {
    id: "c4",
    jobId: "j2",
    score: 91,
    hardScore: 93,
    softScore: 88,
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
  },
  {
    id: "c5",
    jobId: "j2",
    score: 83,
    hardScore: 80,
    softScore: 87,
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
                      <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in-up">
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="p-3 bg-violet-50 rounded-xl">
                            <p className="text-xs text-gray-500 mb-1">{d.strengths}</p>
                            <p className="text-sm font-semibold text-violet-800">{candidate.strengths}</p>
                          </div>
                          <div className="p-3 bg-indigo-50 rounded-xl">
                            <p className="text-xs text-gray-500 mb-1">{d.workStyle}</p>
                            <p className="text-sm font-semibold text-indigo-800">{candidate.workStyle}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-2">{d.allSkills}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {candidate.hardSkills.map((s) => <Badge key={s} variant="hard" className="text-xs">{s}</Badge>)}
                            {candidate.softSkills.map((s) => <Badge key={s} variant="soft" className="text-xs">{s}</Badge>)}
                          </div>
                        </div>

                        <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl mb-4">
                          <p className="text-xs text-amber-800">{d.psychNote}</p>
                        </div>

                        <Link
                          href={`/candidate/profile/${candidate.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="block w-full text-center text-sm text-violet-600 font-medium hover:underline mb-4"
                        >
                          {d.viewFullProfile}
                        </Link>

                        {candidate.status === "pending_review" && (
                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); updateCandidateStatus(candidate.id, "rejected"); }}
                              className="flex-1 text-gray-500"
                            >
                              {d.notRetained}
                            </Button>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); updateCandidateStatus(candidate.id, "hired"); }}
                              className="flex-2 flex-grow-2"
                            >
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
