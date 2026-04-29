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

type B<T = string> = { fr: T; en: T };
const pick = <T,>(b: B<T>, lang: "fr" | "en"): T => b[lang];

interface RecentHire {
  name: string;
  role: string;
  initials: string;
  color: string;
  photo: string;
}

interface GrowthPoint { month: B; value: number; }

interface CompanyData {
  id: string;
  name: string;
  tagline: B;
  industry: string;
  size: string;
  location: string;
  website: string;
  description: B;
  values: B<string[]>;
  logoInitials: string;
  coverGradient: string;
  founded: string;
  techStack: string[];
  perks: B<string[]>;
  manager: { firstName: string; lastName: string; title: string; initials: string };
  growthRate?: string;
  headcount?: number;
  growthData?: GrowthPoint[];
  recentHires?: RecentHire[];
}

interface JobData {
  id: string;
  companyId: string;
  title: string;
  seniority: string;
  experienceYears: number;
  workMode: string;
  location: B;
  salaryMin: number;
  salaryMax: number;
  status: string;
  matchCount: number;
  description: B;
  missions: B<string[]>;
  hardSkills: string[];
  softSkills: B<string[]>;
  process: B<string[]>;
}

const MOCK_COMPANIES: Record<string, CompanyData> = {
  me: {
    id: "me",
    name: "Acme SaaS",
    tagline: {
      fr: "La plateforme B2B de gestion de projet nouvelle génération",
      en: "The next-generation B2B project management platform",
    },
    industry: "Tech / SaaS",
    size: "51-200",
    location: "Paris, France",
    website: "www.acmesaas.com",
    description: {
      fr: "Acme SaaS développe une plateforme de gestion de projet orientée équipes produit. Notre mission : donner aux équipes les outils pour livrer plus vite, sans friction. Nous sommes en forte croissance et recrutons les meilleurs talents pour construire le futur du travail collaboratif.",
      en: "Acme SaaS builds a project management platform designed for product teams. Our mission: give teams the tools to ship faster, without friction. We are growing fast and hiring top talent to build the future of collaborative work.",
    },
    values: {
      fr: ["Innovation", "Impact", "Bienveillance", "Agilité"],
      en: ["Innovation", "Impact", "Kindness", "Agility"],
    },
    logoInitials: "AS",
    coverGradient: "from-indigo-600 to-violet-700",
    founded: "2019",
    techStack: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
    perks: {
      fr: ["Remote-friendly", "Stock options", "Budget formation", "Team retreats", "Mutuelle premium"],
      en: ["Remote-friendly", "Stock options", "Learning budget", "Team retreats", "Premium health insurance"],
    },
    manager: { firstName: "Jean", lastName: "Martin", title: "Head of Product", initials: "JM" },
    growthRate: "+40%",
    headcount: 87,
    growthData: [
      { month: { fr: "Oct", en: "Oct" }, value: 52 },
      { month: { fr: "Nov", en: "Nov" }, value: 58 },
      { month: { fr: "Déc", en: "Dec" }, value: 61 },
      { month: { fr: "Jan", en: "Jan" }, value: 67 },
      { month: { fr: "Fév", en: "Feb" }, value: 75 },
      { month: { fr: "Mar", en: "Mar" }, value: 87 },
    ],
    recentHires: [
      { name: "Karim Benali", role: "Product Manager", initials: "KB", color: "bg-orange-400", photo: "https://i.pravatar.cc/80?u=karimbenali" },
      { name: "Thomas Durand", role: "Lead Developer", initials: "TD", color: "bg-emerald-500", photo: "https://i.pravatar.cc/80?u=thomasdurand" },
      { name: "Léa Martin", role: "Head of Sales", initials: "LM", color: "bg-indigo-400", photo: "https://i.pravatar.cc/80?u=leamartin42" },
      { name: "Sofia Chen", role: "UX Designer", initials: "SC", color: "bg-pink-400", photo: "https://i.pravatar.cc/80?u=sofiachen" },
    ],
  },
  c1: {
    id: "c1",
    name: "FinFlow",
    tagline: {
      fr: "Simplifier la finance pour les PME européennes",
      en: "Simplifying finance for European SMBs",
    },
    industry: "FinTech",
    size: "11-50",
    location: "Paris, France",
    website: "www.finflow.io",
    description: {
      fr: "FinFlow est une FinTech qui repense la gestion financière des PME. Notre app mobile est utilisée par plus de 500 000 entreprises en Europe. Nous sommes en Série B et accélérons notre croissance internationale.",
      en: "FinFlow is a FinTech rethinking financial management for SMBs. Our mobile app is used by over 500,000 businesses across Europe. We are Series B and accelerating international growth.",
    },
    values: {
      fr: ["Performance", "Transparence", "Impact", "Ambition"],
      en: ["Performance", "Transparency", "Impact", "Ambition"],
    },
    logoInitials: "FF",
    coverGradient: "from-emerald-600 to-teal-600",
    founded: "2020",
    techStack: ["React Native", "Python", "Kotlin", "GCP"],
    perks: {
      fr: ["Full Remote", "Equity", "MacBook Pro", "Budget bien-être"],
      en: ["Full Remote", "Equity", "MacBook Pro", "Wellness budget"],
    },
    manager: { firstName: "Sophie", lastName: "Laurent", title: "CPO", initials: "SL" },
    growthRate: "+25%",
    headcount: 34,
    growthData: [
      { month: { fr: "Oct", en: "Oct" }, value: 22 },
      { month: { fr: "Nov", en: "Nov" }, value: 24 },
      { month: { fr: "Déc", en: "Dec" }, value: 26 },
      { month: { fr: "Jan", en: "Jan" }, value: 28 },
      { month: { fr: "Fév", en: "Feb" }, value: 31 },
      { month: { fr: "Mar", en: "Mar" }, value: 34 },
    ],
    recentHires: [
      { name: "Sofia Ferreira", role: "Product Designer", initials: "SF", color: "bg-pink-400", photo: "https://i.pravatar.cc/80?u=sofiaferreira" },
      { name: "Marc Bernard", role: "Backend Engineer", initials: "MB", color: "bg-blue-500", photo: "https://i.pravatar.cc/80?u=marcbernard" },
    ],
  },
};

const MOCK_JOBS: Record<string, JobData[]> = {
  me: [
    {
      id: "j1", companyId: "me", title: "Senior Product Designer", seniority: "Senior",
      experienceYears: 7, workMode: "hybrid",
      location: { fr: "Paris (Hybride)", en: "Paris (Hybrid)" },
      salaryMin: 65000, salaryMax: 80000, status: "open", matchCount: 4,
      description: {
        fr: "Nous cherchons un Product Designer senior pour rejoindre notre équipe produit de 12 personnes. Vous serez responsable de l'expérience globale de notre plateforme B2B, du design system, et de la collaboration avec nos 3 squads produit.\n\nVous travaillerez directement avec le CPO et les product managers pour définir la vision design à long terme.",
        en: "We are looking for a Senior Product Designer to join our 12-person product team. You will own the overall experience of our B2B platform, the design system, and collaboration across our 3 product squads.\n\nYou will work directly with the CPO and PMs to define the long-term design vision.",
      },
      missions: {
        fr: ["Concevoir des interfaces complexes pour notre plateforme B2B SaaS", "Maintenir et faire évoluer notre design system (Figma)", "Mener des sessions de discovery UX avec les clients", "Collaborer quotidiennement avec les équipes engineering", "Participer à la stratégie produit globale"],
        en: ["Design complex interfaces for our B2B SaaS platform", "Maintain and evolve our design system (Figma)", "Run UX discovery sessions with customers", "Collaborate daily with engineering teams", "Contribute to the overall product strategy"],
      },
      hardSkills: ["Figma", "UX Design", "UI Design", "Design System", "Prototyping"],
      softSkills: { fr: ["Leadership", "Communication", "Créativité"], en: ["Leadership", "Communication", "Creativity"] },
      process: {
        fr: ["Call RH (30 min)", "Entretien PM + Designer (1h)", "Case study (3j)", "Culture fit CEO (45 min)"],
        en: ["HR Call (30 min)", "PM + Designer Interview (1h)", "Case study (3d)", "Culture fit CEO (45 min)"],
      },
    },
    {
      id: "j2", companyId: "me", title: "Product Manager B2B SaaS", seniority: "Mid",
      experienceYears: 4, workMode: "hybrid",
      location: { fr: "Paris (Hybride)", en: "Paris (Hybrid)" },
      salaryMin: 55000, salaryMax: 70000, status: "open", matchCount: 7,
      description: {
        fr: "Rejoignez notre squad Growth en tant que Product Manager. Vous serez en charge du parcours d'activation et de la rétention utilisateur, avec un impact direct sur notre ARR.\n\nPoste clé pour quelqu'un qui aime les données, les utilisateurs et l'expérimentation rapide.",
        en: "Join our Growth squad as a Product Manager. You will own the activation and user retention journey, with a direct impact on our ARR.\n\nKey role for someone who loves data, users and rapid experimentation.",
      },
      missions: {
        fr: ["Définir et prioriser le roadmap de votre squad", "Analyser les données produit et identifier les opportunités de croissance", "Organiser les sprints et cérémonies Agile", "Collaborer avec Design, Engineering et Sales", "Présenter les résultats au leadership mensuel"],
        en: ["Define and prioritise your squad's roadmap", "Analyse product data and identify growth opportunities", "Organise Agile sprints and ceremonies", "Collaborate with Design, Engineering and Sales", "Present results to leadership monthly"],
      },
      hardSkills: ["Product Management", "Agile/Scrum", "SQL", "Jira", "Analytics"],
      softSkills: { fr: ["Communication", "Leadership", "Orientation résultats"], en: ["Communication", "Leadership", "Results-oriented"] },
      process: {
        fr: ["Call RH (30 min)", "Entretien Head of Product (1h)", "Cas pratique (4j)", "Panel équipe (1h30)"],
        en: ["HR Call (30 min)", "Head of Product Interview (1h)", "Practical case (4d)", "Team panel (1h30)"],
      },
    },
    {
      id: "j3", companyId: "me", title: "Lead Frontend Engineer", seniority: "Lead / Expert",
      experienceYears: 6, workMode: "remote",
      location: { fr: "Full Remote", en: "Full Remote" },
      salaryMin: 75000, salaryMax: 95000, status: "open", matchCount: 3,
      description: {
        fr: "Nous cherchons un Lead Frontend pour prendre la tête de notre frontend guild (6 ingénieurs). Vous définirez les standards techniques, piloterez les choix d'architecture et contribuerez activement au code.",
        en: "We are looking for a Lead Frontend to head our frontend guild (6 engineers). You will define technical standards, drive architecture decisions and actively contribute to the codebase.",
      },
      missions: {
        fr: ["Définir et faire évoluer l'architecture frontend (React / TypeScript)", "Mentorer les ingénieurs junior et mid", "Collaborer avec le design pour garantir la qualité de l'implémentation", "Conduire les code reviews et définir les standards qualité", "Participer aux décisions produit/technique avec le CTO"],
        en: ["Define and evolve the frontend architecture (React / TypeScript)", "Mentor junior and mid engineers", "Collaborate with design to ensure implementation quality", "Lead code reviews and define quality standards", "Participate in product/tech decisions with the CTO"],
      },
      hardSkills: ["React", "TypeScript", "Node.js", "Performance Web", "Testing"],
      softSkills: { fr: ["Leadership", "Pédagogie", "Communication"], en: ["Leadership", "Teaching ability", "Communication"] },
      process: {
        fr: ["Call RH (30 min)", "Entretien Tech (1h30)", "Live coding (1h)", "Onsite avec l'équipe (2h)"],
        en: ["HR Call (30 min)", "Tech Interview (1h30)", "Live coding (1h)", "Team onsite (2h)"],
      },
    },
  ],
  c1: [
    {
      id: "j4", companyId: "c1", title: "Lead Product Designer Mobile", seniority: "Lead / Expert",
      experienceYears: 8, workMode: "remote",
      location: { fr: "Full Remote", en: "Full Remote" },
      salaryMin: 70000, salaryMax: 90000, status: "open", matchCount: 2,
      description: {
        fr: "Diriger la vision design de notre application mobile utilisée par 500k PME en Europe. Poste stratégique avec un impact direct sur notre croissance.",
        en: "Lead the design vision for our mobile app used by 500k SMBs across Europe. Strategic role with direct impact on our growth.",
      },
      missions: {
        fr: ["Définir la vision design de l'app mobile (iOS / Android)", "Manager une équipe de 3 designers", "Conduire la recherche utilisateur avec nos clients PME", "Collaborer avec les équipes produit et engineering"],
        en: ["Define the mobile app design vision (iOS / Android)", "Manage a team of 3 designers", "Lead user research with our SMB customers", "Collaborate with product and engineering teams"],
      },
      hardSkills: ["Figma", "Mobile Design", "UX Design", "Design System"],
      softSkills: { fr: ["Leadership", "Autonomie", "Orientation résultats"], en: ["Leadership", "Autonomy", "Results-oriented"] },
      process: {
        fr: ["Call HR (30 min)", "Portfolio review (1h)", "Case study (1 semaine)", "Entretien CEO"],
        en: ["HR Call (30 min)", "Portfolio review (1h)", "Case study (1 week)", "CEO Interview"],
      },
    },
  ],
};

const ALL_VALUES_FR = ["Innovation", "Impact", "Bienveillance", "Excellence", "Diversité", "Agilité", "Transparence", "Ambition", "Performance"];
const ALL_VALUES_EN = ["Innovation", "Impact", "Kindness", "Excellence", "Diversity", "Agility", "Transparency", "Ambition", "Performance"];
const ALL_INDUSTRIES = ["Tech / SaaS", "FinTech", "HealthTech", "E-commerce", "Media / Content", "Consulting", "Agency", "Industry", "Retail", "Education"];
const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "500+"];
const ALL_PERKS_FR = ["Remote-friendly", "Full Remote", "Stock options", "Equity", "Budget formation", "Team retreats", "Mutuelle premium", "MacBook Pro", "Budget bien-être", "Crèche", "RTT supplémentaires"];
const ALL_PERKS_EN = ["Remote-friendly", "Full Remote", "Stock options", "Equity", "Learning budget", "Team retreats", "Premium health insurance", "MacBook Pro", "Wellness budget", "Childcare", "Extra days off"];

function GrowthChart({ data, growthRate, headcount, lang }: { data: GrowthPoint[]; growthRate: string; headcount: number; lang: "fr" | "en" }) {
  const max = Math.max(...data.map((d) => d.value));
  const chartH = 64;
  const barW = 28;
  const gap = 10;
  const totalW = data.length * (barW + gap) - gap;
  const employeesLabel = lang === "en" ? "employees" : "collaborateurs";
  const vsLabel = lang === "en" ? "vs last year" : "vs année précédente";

  return (
    <div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-3xl font-extrabold text-gray-900">{headcount}</span>
        <span className="text-sm text-gray-400 font-medium">{employeesLabel}</span>
      </div>
      <div className="flex items-center gap-1.5 mb-4">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="#10b981"><polygon points="5,0 10,10 0,10" /></svg>
        <span className="text-sm font-bold text-emerald-500">{growthRate}</span>
        <span className="text-xs text-gray-400">{vsLabel}</span>
      </div>
      <svg width="100%" viewBox={`0 0 ${totalW} ${chartH + 20}`} preserveAspectRatio="xMidYMid meet">
        {data.map((d, i) => {
          const barH = Math.max(4, (d.value / max) * chartH);
          const x = i * (barW + gap);
          const isLast = i === data.length - 1;
          return (
            <g key={i}>
              <rect
                x={x} y={chartH - barH} width={barW} height={barH}
                rx="5"
                fill={isLast ? "#6366f1" : "#e0e7ff"}
              />
              <text x={x + barW / 2} y={chartH + 14} textAnchor="middle" fontSize="9" fill="#9ca3af">{pick(d.month, lang)}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function JobDetail({ job, isOwn, onClose, lang }: { job: JobData; isOwn: boolean; onClose: () => void; lang: "fr" | "en" }) {
  const { t } = useLang();
  const p = t.companyProfile;
  const workModeLabel = Object.fromEntries(t.onboardingCandidate.workModes.map(({ v, l }) => [v, l]));
  const yrs = lang === "en" ? "yrs" : "ans";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl h-full bg-white shadow-2xl overflow-y-auto animate-slide-in">
        <div className={cn("h-24 bg-gradient-to-r", "from-violet-600 to-indigo-700")} />
        <div className="px-6 pb-6">
          <div className="flex items-start justify-between -mt-5 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-violet-600 font-bold text-xl border-4 border-white">📋</div>
            <button type="button" onClick={onClose} className="mt-6 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h2>
            <div className="flex flex-wrap gap-2 text-sm text-gray-500">
              <span>{job.seniority} • {job.experienceYears}+ {yrs}</span>
              <span>•</span><span>{workModeLabel[job.workMode]}</span>
              <span>•</span><span>{pick(job.location, lang)}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="success" className="text-xs">{p.open}</Badge>
              {job.salaryMin && <Badge variant="secondary" className="text-xs">💰 {(job.salaryMin / 1000).toFixed(0)}-{(job.salaryMax / 1000).toFixed(0)}k€</Badge>}
              {isOwn && <Badge variant="default" className="text-xs">🎯 {job.matchCount} {p.matches}</Badge>}
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">{p.panelPosition}</h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{pick(job.description, lang)}</p>
          </div>
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">{p.panelMissions}</h3>
            <ul className="space-y-2">
              {pick(job.missions, lang).map((m, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-gray-600">
                  <span className="text-violet-400 flex-shrink-0 mt-0.5">→</span><span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">{p.panelSkills}</h3>
            <div className="flex flex-wrap gap-2 mb-2">{job.hardSkills.map((s) => <Badge key={s} variant="hard" className="text-sm py-1 px-3">{s}</Badge>)}</div>
            <div className="flex flex-wrap gap-2">{pick(job.softSkills, lang).map((s) => <Badge key={s} variant="soft" className="text-sm py-1 px-3">{s}</Badge>)}</div>
          </div>
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">{p.panelProcess}</h3>
            <div className="space-y-2">
              {pick(job.process, lang).map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</div>
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
            <Button variant="gradient" size="lg" className="w-full">{p.apply}</Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CompanyProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { t, lang } = useLang();
  const p = t.companyProfile;

  const isOwn = id === "me";
  const rawCompany = MOCK_COMPANIES[id] ?? MOCK_COMPANIES["me"];
  const rawJobs = MOCK_JOBS[id] ?? MOCK_JOBS["me"];

  const [company, setCompany] = useState<CompanyData>(rawCompany);
  const [jobs] = useState<JobData[]>(rawJobs);
  const [editing, setEditing] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);

  const allValues = lang === "en" ? ALL_VALUES_EN : ALL_VALUES_FR;
  const allPerks = lang === "en" ? ALL_PERKS_EN : ALL_PERKS_FR;
  const lastMonths = lang === "en" ? "last 6 months" : "6 derniers mois";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => router.back()} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all">
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
              !editing ? (
                <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>{p.editProfile}</Button>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={() => { setCompany(rawCompany); setEditing(false); }}>{p.cancel}</Button>
                  <Button variant="success" size="sm" onClick={() => setEditing(false)}>{p.save}</Button>
                </>
              )
            )}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-6">

          {/* ── SIDEBAR ── */}
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
                    <div><Label className="text-xs">{p.companyName}</Label><Input value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} className="text-sm h-8 mt-1" /></div>
                    <div><Label className="text-xs">{p.tagline}</Label><Input value={pick(company.tagline, lang)} onChange={(e) => setCompany({ ...company, tagline: { ...company.tagline, [lang]: e.target.value } })} className="text-sm h-8 mt-1" /></div>
                    <div><Label className="text-xs">{p.locationLabel}</Label><Input value={company.location} onChange={(e) => setCompany({ ...company, location: e.target.value })} className="text-sm h-8 mt-1" /></div>
                    <div><Label className="text-xs">{p.website}</Label><Input value={company.website} onChange={(e) => setCompany({ ...company, website: e.target.value })} className="text-sm h-8 mt-1" /></div>
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
                    <p className="text-sm text-gray-500 mt-0.5">{pick(company.tagline, lang)}</p>
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
                    {allValues.map((val, idx) => {
                      const frVal = ALL_VALUES_FR[idx];
                      const enVal = ALL_VALUES_EN[idx];
                      const isSelected = company.values.fr.includes(frVal);
                      return (
                        <button key={val} type="button"
                          onClick={() => setCompany((c) => ({
                            ...c,
                            values: {
                              fr: isSelected ? c.values.fr.filter((v) => v !== frVal) : [...c.values.fr, frVal],
                              en: isSelected ? c.values.en.filter((v) => v !== enVal) : [...c.values.en, enVal],
                            },
                          }))}
                          className={cn("px-2.5 py-1 rounded-full text-xs border transition-all", isSelected ? "bg-violet-600 border-violet-600 text-white" : "border-gray-200 text-gray-600 hover:border-violet-300")}>
                          {val}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {pick(company.values, lang).map((v) => <Badge key={v} variant="default" className="text-xs">{v}</Badge>)}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-none border-gray-100">
              <CardContent className="pt-4 pb-4">
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">{p.techStack}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {company.techStack.map((tech) => <Badge key={tech} variant="hard" className="text-xs">{tech}</Badge>)}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-none border-gray-100">
              <CardContent className="pt-4 pb-4">
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">{p.perks}</h3>
                {editing ? (
                  <div className="flex flex-wrap gap-1.5">
                    {allPerks.map((perk, idx) => {
                      const frPerk = ALL_PERKS_FR[idx];
                      const enPerk = ALL_PERKS_EN[idx];
                      const isSelected = company.perks.fr.includes(frPerk);
                      return (
                        <button key={perk} type="button"
                          onClick={() => setCompany((c) => ({
                            ...c,
                            perks: {
                              fr: isSelected ? c.perks.fr.filter((pk) => pk !== frPerk) : [...c.perks.fr, frPerk],
                              en: isSelected ? c.perks.en.filter((pk) => pk !== enPerk) : [...c.perks.en, enPerk],
                            },
                          }))}
                          className={cn("px-2.5 py-1 rounded-full text-xs border transition-all", isSelected ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-200 text-gray-600 hover:border-emerald-300")}>
                          {perk}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {pick(company.perks, lang).map((pk) => (
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
                  <img
                    src={`https://i.pravatar.cc/80?u=${company.manager.firstName}${company.manager.lastName}`}
                    alt={company.manager.firstName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{company.manager.firstName} {company.manager.lastName}</p>
                    <p className="text-xs text-gray-500">{company.manager.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── MAIN ── */}
          <div className="md:col-span-2 space-y-4">

            <Card className="shadow-none border-gray-100">
              <CardContent className="pt-5 pb-5">
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">{p.about}</h2>
                {editing ? (
                  <Textarea value={pick(company.description, lang)} onChange={(e) => setCompany({ ...company, description: { ...company.description, [lang]: e.target.value } })} className="h-36 text-sm" />
                ) : (
                  <p className="text-sm text-gray-600 leading-relaxed">{pick(company.description, lang)}</p>
                )}
              </CardContent>
            </Card>

            {/* ── GROWTH CHART ── */}
            {company.growthData && company.growthRate && company.headcount && (
              <Card className="shadow-none border-gray-100">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{p.growthRate}</h2>
                    <span className="text-xs text-gray-400">{lastMonths}</span>
                  </div>
                  <GrowthChart data={company.growthData} growthRate={company.growthRate} headcount={company.headcount} lang={lang} />
                </CardContent>
              </Card>
            )}

            {/* ── RECENT HIRES ── */}
            {company.recentHires && company.recentHires.length > 0 && (
              <Card className="shadow-none border-gray-100">
                <CardContent className="pt-5 pb-5">
                  <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">{p.recentHires}</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {company.recentHires.map((hire, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-indigo-50/60 transition-colors">
                        <img
                          src={hire.photo}
                          alt={hire.name}
                          className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextElementSibling?.classList.remove("hidden");
                          }}
                        />
                        <div className={cn("w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 hidden", hire.color)}>
                          {hire.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{hire.name}</p>
                          <p className="text-xs text-gray-400 truncate">{hire.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ── OPEN ROLES ── */}
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
                  <Card key={job.id} className="shadow-none border-gray-100 cursor-pointer hover:shadow-md hover:border-violet-200 transition-all group" onClick={() => setSelectedJob(job)}>
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900 group-hover:text-violet-700 transition-colors">{job.title}</h3>
                            <Badge variant="success" className="text-xs">{p.open}</Badge>
                          </div>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400 mb-3">
                            <span>{job.seniority} • {job.experienceYears}+ {lang === "en" ? "yrs" : "ans"}</span>
                            <span>{pick(job.location, lang)}</span>
                            {job.salaryMin && <span className="font-medium text-gray-600">{(job.salaryMin / 1000).toFixed(0)}-{(job.salaryMax / 1000).toFixed(0)}k€</span>}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {job.hardSkills.slice(0, 4).map((s) => <Badge key={s} variant="hard" className="text-xs">{s}</Badge>)}
                            {pick(job.softSkills, lang).slice(0, 2).map((s) => <Badge key={s} variant="soft" className="text-xs">{s}</Badge>)}
                            {job.hardSkills.length + job.softSkills.fr.length > 6 && <span className="text-xs text-gray-400 self-center">+{job.hardSkills.length + job.softSkills.fr.length - 6}</span>}
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

      {selectedJob && <JobDetail job={selectedJob} isOwn={isOwn} onClose={() => setSelectedJob(null)} lang={lang} />}
    </div>
  );
}
