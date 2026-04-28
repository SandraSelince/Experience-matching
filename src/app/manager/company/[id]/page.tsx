"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLang } from "@/lib/i18n/context";
import { LangToggle } from "@/components/shared/LangToggle";
import { cn } from "@/lib/utils";

const MOCK_COMPANIES: Record<string, CompanyData> = {
  me: {
    id: "me",
    name: "Acme SaaS",
    tagline: "La plateforme B2B de gestion de projet nouvelle génération",
    industry: "Tech / SaaS",
    size: "51-200",
    location: "Paris, France",
    website: "www.acmesaas.com",
    description:
      "Acme SaaS développe une plateforme de gestion de projet orientée équipes produit. Notre mission : donner aux équipes les outils pour livrer plus vite, sans friction. Nous sommes en forte croissance (+200% ARR cette année) et recrutons les meilleurs talents pour construire le futur du travail collaboratif.",
    values: ["Innovation", "Impact", "Bienveillance", "Agilité"],
    logoInitials: "AS",
    coverGradient: "from-indigo-600 to-violet-700",
    founded: "2019",
    techStack: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
    perks: ["Remote-friendly", "Stock options", "Budget formation", "Team retreats", "Mutuelle premium"],
    manager: {
      firstName: "Jean",
      lastName: "Martin",
      title: "Head of Product",
      initials: "JM",
    },
  },
  c1: {
    id: "c1",
    name: "FinFlow",
    tagline: "Simplifier la finance pour les PME européennes",
    industry: "FinTech",
    size: "11-50",
    location: "Paris, France",
    website: "www.finflow.io",
    description:
      "FinFlow est une FinTech qui repense la gestion financière des PME. Notre app mobile est utilisée par plus de 500 000 entreprises en Europe. Nous sommes en Série B et accélérons notre croissance internationale.",
    values: ["Performance", "Transparence", "Impact", "Ambition"],
    logoInitials: "FF",
    coverGradient: "from-emerald-600 to-teal-600",
    founded: "2020",
    techStack: ["React Native", "Python", "Kotlin", "GCP"],
    perks: ["Full Remote", "Equity", "MacBook Pro", "Budget bien-être"],
    manager: {
      firstName: "Sophie",
      lastName: "Laurent",
      title: "CPO",
      initials: "SL",
    },
  },
};

const MOCK_JOBS: Record<string, JobData[]> = {
  me: [
    {
      id: "j1",
      companyId: "me",
      title: "Senior Product Designer",
      seniority: "Senior",
      experienceYears: 7,
      workMode: "hybrid",
      location: "Paris (Hybride)",
      salaryMin: 65000,
      salaryMax: 80000,
      status: "open",
      matchCount: 4,
      description:
        "Nous cherchons un Product Designer senior pour rejoindre notre équipe produit de 12 personnes. Vous serez responsable de l'expérience globale de notre plateforme B2B, du design system, et de la collaboration avec nos 3 squads produit.\n\nVous travaillerez directement avec le CPO et les product managers pour définir la vision design à long terme.",
      missions: [
        "Concevoir des interfaces complexes pour notre plateforme B2B SaaS",
        "Maintenir et faire évoluer notre design system (Figma)",
        "Mener des sessions de discovery UX avec les clients",
        "Collaborer quotidiennement avec les équipes engineering",
        "Participer à la stratégie produit globale",
      ],
      hardSkills: ["Figma", "UX Design", "UI Design", "Design System", "Prototypage"],
      softSkills: ["Leadership", "Communication", "Créativité"],
      process: ["Call RH (30 min)", "Entretien PM + Designer (1h)", "Case study (3j)", "Culture fit CEO (45 min)"],
    },
    {
      id: "j2",
      companyId: "me",
      title: "Product Manager B2B SaaS",
      seniority: "Mid",
      experienceYears: 4,
      workMode: "hybrid",
      location: "Paris (Hybride)",
      salaryMin: 55000,
      salaryMax: 70000,
      status: "open",
      matchCount: 7,
      description:
        "Rejoignez notre squad Growth en tant que Product Manager. Vous serez en charge du parcours d'activation et de la rétention utilisateur, avec un impact direct sur notre ARR.\n\nPoste clé pour quelqu'un qui aime les données, les utilisateurs et l'expérimentation rapide.",
      missions: [
        "Définir et prioriser le roadmap de votre squad",
        "Analyser les données produit et identifier les opportunités de croissance",
        "Organiser les sprints et cérémonies Agile",
        "Collaborer avec Design, Engineering et Sales",
        "Présenter les résultats au leadership mensuel",
      ],
      hardSkills: ["Product Management", "Agile/Scrum", "SQL", "Jira", "Analytics"],
      softSkills: ["Communication", "Leadership", "Orientation résultats"],
      process: ["Call RH (30 min)", "Entretien Head of Product (1h)", "Cas pratique (4j)", "Panel équipe (1h30)"],
    },
    {
      id: "j3",
      companyId: "me",
      title: "Lead Frontend Engineer",
      seniority: "Lead / Expert",
      experienceYears: 6,
      workMode: "remote",
      location: "Full Remote",
      salaryMin: 75000,
      salaryMax: 95000,
      status: "open",
      matchCount: 3,
      description:
        "Nous cherchons un Lead Frontend pour prendre la tête de notre frontend guild (6 ingénieurs). Vous définirez les standards techniques, piloterez les choix d'architecture et contribuerez activement au code.",
      missions: [
        "Définir et faire évoluer l'architecture frontend (React / TypeScript)",
        "Mentorer les ingénieurs junior et mid",
        "Collaborer avec le design pour garantir la qualité de l'implémentation",
        "Conduire les code reviews et définir les standards qualité",
        "Participer aux décisions produit/technique avec le CTO",
      ],
      hardSkills: ["React", "TypeScript", "Node.js", "Performance Web", "Testing"],
      softSkills: ["Leadership", "Pédagogie", "Communication"],
      process: ["Call RH (30 min)", "Entretien Tech (1h30)", "Live coding (1h)", "Onsite avec l'équipe (2h)"],
    },
  ],
  c1: [
    {
      id: "j4",
      companyId: "c1",
      title: "Lead Product Designer Mobile",
      seniority: "Lead / Expert",
      experienceYears: 8,
      workMode: "remote",
      location: "Full Remote",
      salaryMin: 70000,
      salaryMax: 90000,
      status: "open",
      matchCount: 2,
      description:
        "Diriger la vision design de notre application mobile utilisée par 500k PME en Europe. Poste stratégique avec un impact direct sur notre croissance.",
      missions: [
        "Définir la vision design de l'app mobile (iOS / Android)",
        "Manager une équipe de 3 designers",
        "Conduire la recherche utilisateur avec nos clients PME",
        "Collaborer avec les équipes produit et engineering",
      ],
      hardSkills: ["Figma", "Mobile Design", "UX Design", "Design System"],
      softSkills: ["Leadership", "Autonomie", "Orientation résultats"],
      process: ["Call HR (30 min)", "Portfolio review (1h)", "Case study (1 semaine)", "Entretien CEO"],
    },
  ],
};

interface CompanyData {
  id: string;
  name: string;
  tagline: string;
  industry: string;
  size: string;
  location: string;
  website: string;
  description: string;
  values: string[];
  logoInitials: string;
  coverGradient: string;
  founded: string;
  techStack: string[];
  perks: string[];
  manager: { firstName: string; lastName: string; title: string; initials: string };
}

interface JobData {
  id: string;
  companyId: string;
  title: string;
  seniority: string;
  experienceYears: number;
  workMode: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  status: string;
  matchCount: number;
  description: string;
  missions: string[];
  hardSkills: string[];
  softSkills: string[];
  process: string[];
}

const ALL_VALUES = ["Innovation", "Impact", "Bienveillance", "Excellence", "Diversité", "Agilité", "Transparence", "Ambition", "Performance"];
const ALL_INDUSTRIES = ["Tech / SaaS", "FinTech", "HealthTech", "E-commerce", "Média / Contenu", "Conseil", "Agence", "Industrie", "Retail", "Éducation"];
const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "500+"];
const ALL_PERKS = ["Remote-friendly", "Full Remote", "Stock options", "Equity", "Budget formation", "Team retreats", "Mutuelle premium", "MacBook Pro", "Budget bien-être", "Crèche", "RTT supplémentaires"];

function JobDetail({ job, isOwn, onClose }: { job: JobData; isOwn: boolean; onClose: () => void }) {
  const { t } = useLang();
  const p = t.companyProfile;
  const workModeLabel = Object.fromEntries(t.onboardingCandidate.workModes.map(({ v, l }) => [v, l]));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl h-full bg-white shadow-2xl overflow-y-auto animate-slide-in">
        <div className={cn("h-24 bg-gradient-to-r", "from-violet-600 to-indigo-700")} />
        <div className="px-6 pb-6">
          <div className="flex items-start justify-between -mt-5 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-violet-600 font-bold text-xl border-4 border-white">
              📋
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h2>
            <div className="flex flex-wrap gap-2 text-sm text-gray-500">
              <span>{job.seniority} • {job.experienceYears}+ ans</span>
              <span>•</span>
              <span>{workModeLabel[job.workMode]}</span>
              <span>•</span>
              <span>{job.location}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="success" className="text-xs">{p.open}</Badge>
              {job.salaryMin && (
                <Badge variant="secondary" className="text-xs">
                  💰 {(job.salaryMin / 1000).toFixed(0)}-{(job.salaryMax / 1000).toFixed(0)}k€
                </Badge>
              )}
              {isOwn && (
                <Badge variant="default" className="text-xs">
                  🎯 {job.matchCount} {p.matches}
                </Badge>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">{p.panelPosition}</h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">{p.panelMissions}</h3>
            <ul className="space-y-2">
              {job.missions.map((m, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-gray-600">
                  <span className="text-violet-400 flex-shrink-0 mt-0.5">→</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">{p.panelSkills}</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {job.hardSkills.map((s) => <Badge key={s} variant="hard" className="text-sm py-1 px-3">{s}</Badge>)}
            </div>
            <div className="flex flex-wrap gap-2">
              {job.softSkills.map((s) => <Badge key={s} variant="soft" className="text-sm py-1 px-3">{s}</Badge>)}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">{p.panelProcess}</h3>
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

          {isOwn ? (
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onClose}>{p.close}</Button>
              <Link href="/manager/dashboard" className="flex-2 flex-grow-2">
                <Button variant="gradient" className="w-full">{p.viewCandidates}</Button>
              </Link>
            </div>
          ) : (
            <Button variant="gradient" size="lg" className="w-full">
              {p.apply}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CompanyProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useLang();
  const p = t.companyProfile;

  const isOwn = id === "me";
  const rawCompany = MOCK_COMPANIES[id] ?? MOCK_COMPANIES["me"];
  const rawJobs = MOCK_JOBS[id] ?? MOCK_JOBS["me"];

  const [company, setCompany] = useState<CompanyData>(rawCompany);
  const [jobs] = useState<JobData[]>(rawJobs);
  const [editing, setEditing] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">EM</div>
              <span className="font-semibold text-gray-800 text-sm hidden sm:block">Experience Matching</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LangToggle />
            {isOwn && (
              <>
                {!editing ? (
                  <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
                    {p.editProfile}
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" size="sm" onClick={() => { setCompany(rawCompany); setEditing(false); }}>{p.cancel}</Button>
                    <Button variant="success" size="sm" onClick={() => setEditing(false)}>{p.save}</Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-6">

          <div className="md:col-span-1 space-y-4">

            <Card className="shadow-none border-gray-100 overflow-hidden">
              <div className={cn("h-24 bg-gradient-to-br", company.coverGradient)} />
              <CardContent className="pt-0 pb-5">
                <div className="-mt-8 mb-4 flex items-end justify-between">
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-md bg-gradient-to-br", company.coverGradient)}>
                    {company.logoInitials}
                  </div>
                  {isOwn && <Badge variant="success" className="text-xs mb-1">{p.verified}</Badge>}
                </div>

                {editing ? (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">{p.companyName}</Label>
                      <Input value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} className="text-sm h-8 mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs">{p.tagline}</Label>
                      <Input value={company.tagline} onChange={(e) => setCompany({ ...company, tagline: e.target.value })} className="text-sm h-8 mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs">{p.locationLabel}</Label>
                      <Input value={company.location} onChange={(e) => setCompany({ ...company, location: e.target.value })} className="text-sm h-8 mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs">{p.website}</Label>
                      <Input value={company.website} onChange={(e) => setCompany({ ...company, website: e.target.value })} className="text-sm h-8 mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs">{p.sector}</Label>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {ALL_INDUSTRIES.slice(0, 6).map((ind) => (
                          <button key={ind} type="button" onClick={() => setCompany({ ...company, industry: ind })}
                            className={cn("px-2 py-1 rounded-full text-xs border transition-all", company.industry === ind ? "bg-indigo-600 border-indigo-600 text-white" : "border-gray-200 text-gray-600 hover:border-indigo-300")}>
                            {ind}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">{p.size}</Label>
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        {COMPANY_SIZES.map((s) => (
                          <button key={s} type="button" onClick={() => setCompany({ ...company, size: s })}
                            className={cn("px-2 py-1 rounded-full text-xs border transition-all", company.size === s ? "bg-indigo-600 border-indigo-600 text-white" : "border-gray-200 text-gray-600 hover:border-indigo-300")}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-lg font-bold text-gray-900">{company.name}</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{company.tagline}</p>
                    <div className="flex flex-col gap-1.5 mt-3 text-xs text-gray-400">
                      <span>🏢 {company.industry} • {company.size} {p.employees}</span>
                      <span>📍 {company.location}</span>
                      <span>🌐 {company.website}</span>
                      <span>📅 {p.founded} {company.founded}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-none border-gray-100">
              <CardContent className="pt-4 pb-4">
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">{p.values}</h3>
                {editing ? (
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_VALUES.map((val) => (
                      <button key={val} type="button"
                        onClick={() => setCompany((c) => ({ ...c, values: c.values.includes(val) ? c.values.filter((v) => v !== val) : [...c.values, val] }))}
                        className={cn("px-2.5 py-1 rounded-full text-xs border transition-all", company.values.includes(val) ? "bg-violet-600 border-violet-600 text-white" : "border-gray-200 text-gray-600 hover:border-violet-300")}>
                        {val}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {company.values.map((v) => <Badge key={v} variant="default" className="text-xs">{v}</Badge>)}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-none border-gray-100">
              <CardContent className="pt-4 pb-4">
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">{p.techStack}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {company.techStack.map((t) => <Badge key={t} variant="hard" className="text-xs">{t}</Badge>)}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-none border-gray-100">
              <CardContent className="pt-4 pb-4">
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">{p.perks}</h3>
                {editing ? (
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_PERKS.map((perk) => (
                      <button key={perk} type="button"
                        onClick={() => setCompany((c) => ({ ...c, perks: c.perks.includes(perk) ? c.perks.filter((pk) => pk !== perk) : [...c.perks, perk] }))}
                        className={cn("px-2.5 py-1 rounded-full text-xs border transition-all", company.perks.includes(perk) ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-200 text-gray-600 hover:border-emerald-300")}>
                        {perk}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {company.perks.map((pk) => (
                      <div key={pk} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-emerald-500">✓</span> {pk}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-none border-gray-100">
              <CardContent className="pt-4 pb-4">
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">{p.contact}</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                    {company.manager.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{company.manager.firstName} {company.manager.lastName}</p>
                    <p className="text-xs text-gray-500">{company.manager.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-4">

            <Card className="shadow-none border-gray-100">
              <CardContent className="pt-5 pb-5">
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">{p.about}</h2>
                {editing ? (
                  <Textarea
                    value={company.description}
                    onChange={(e) => setCompany({ ...company, description: e.target.value })}
                    className="h-36 text-sm"
                  />
                ) : (
                  <p className="text-sm text-gray-600 leading-relaxed">{company.description}</p>
                )}
              </CardContent>
            </Card>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  {p.openRoles} <span className="text-violet-600 ml-1">{jobs.filter((j) => j.status === "open").length}</span>
                </h2>
                {isOwn && (
                  <Link href="/manager/onboarding">
                    <Button variant="gradient" size="sm">+ {t.nav.newJob}</Button>
                  </Link>
                )}
              </div>

              <div className="space-y-3">
                {jobs.map((job) => (
                  <Card
                    key={job.id}
                    className="shadow-none border-gray-100 cursor-pointer hover:shadow-md hover:border-violet-200 transition-all group"
                    onClick={() => setSelectedJob(job)}
                  >
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900 group-hover:text-violet-700 transition-colors">
                              {job.title}
                            </h3>
                            <Badge variant="success" className="text-xs">{p.open}</Badge>
                          </div>

                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400 mb-3">
                            <span>{job.seniority} • {job.experienceYears}+ ans</span>
                            <span>{job.location}</span>
                            {job.salaryMin && (
                              <span className="font-medium text-gray-600">
                                {(job.salaryMin / 1000).toFixed(0)}-{(job.salaryMax / 1000).toFixed(0)}k€
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {job.hardSkills.slice(0, 4).map((s) => <Badge key={s} variant="hard" className="text-xs">{s}</Badge>)}
                            {job.softSkills.slice(0, 2).map((s) => <Badge key={s} variant="soft" className="text-xs">{s}</Badge>)}
                            {job.hardSkills.length + job.softSkills.length > 6 && (
                              <span className="text-xs text-gray-400 self-center">+{job.hardSkills.length + job.softSkills.length - 6}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          {isOwn && (
                            <div className="text-center">
                              <div className="text-lg font-extrabold text-violet-600">{job.matchCount}</div>
                              <div className="text-xs text-gray-400 leading-tight">{p.matches}</div>
                            </div>
                          )}
                          <span className="text-violet-400 group-hover:translate-x-1 transition-transform text-lg">→</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {jobs.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <div className="text-4xl mb-3">📋</div>
                    <p className="font-medium">{p.noJobs}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedJob && (
        <JobDetail
          job={selectedJob}
          isOwn={isOwn}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}
