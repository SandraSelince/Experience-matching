"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useLang } from "@/lib/i18n/context";
import { LangToggle } from "@/components/shared/LangToggle";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

type B<T = string> = { fr: T; en: T };
const pick = <T,>(b: B<T>, lang: "fr" | "en"): T => b[lang];

interface Collaborator {
  id: string;
  name: string;
  email: string;
  initials: string;
  color: string;
  status: "viewing" | "pending";
}

interface FeedbackEntry {
  collaborator: Collaborator;
  rating: number;
  comment: B;
}

interface Candidate {
  id: string;
  jobId: string;
  score: number;
  hardScore: number;
  softScore: number;
  roleFit: number;
  cultureFit: number;
  practicalFit: number;
  status: string;
  bookmarked: boolean;
  interviewRequested: boolean;
  feedbackRequested: string[]; // collaborator ids
  feedbackEntries: FeedbackEntry[];
  name: string;
  title: string;
  seniority: B;
  location: string;
  workMode: string;
  hardSkills: string[];
  softSkills: B<string[]>;
  strengths: B;
  workStyle: B;
  whyMatch: B<string[]>;
  risks: B<string[]>;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_COLLABORATORS: Collaborator[] = [
  { id: "col1", name: "Sarah Laurent", email: "sarah@acme.com", initials: "SL", color: "bg-pink-400", status: "viewing" },
  { id: "col2", name: "Marc Vidal", email: "marc@acme.com", initials: "MV", color: "bg-blue-400", status: "viewing" },
  { id: "col3", name: "Julie Chen", email: "julie@acme.com", initials: "JC", color: "bg-emerald-400", status: "pending" },
];

const MOCK_JOBS = [
  {
    id: "j1",
    title: "Senior Product Designer",
    seniority: "Senior",
    experienceYears: 7,
    workMode: "hybrid",
    location: { fr: "Paris (Hybride)", en: "Paris (Hybrid)" } as B,
    status: "open",
    hardSkills: ["Figma", "UX Design", "UI Design", "Design System"],
    softSkills: { fr: ["Leadership", "Communication", "Créativité"], en: ["Leadership", "Communication", "Creativity"] } as B<string[]>,
    firstStep: { fr: "Call RH (30 min)", en: "HR Call (30 min)" } as B,
    steps: {
      fr: ["Call RH (30 min)", "Entretien technique avec le Lead Design (1h)", "Entretien culture fit avec le CPO (45 min)", "Offre"],
      en: ["HR Call (30 min)", "Technical interview with Lead Design (1h)", "Culture fit interview with CPO (45 min)", "Offer"],
    } as B<string[]>,
    matchCount: 4,
    newCount: 2,
  },
  {
    id: "j2",
    title: "Product Manager B2B SaaS",
    seniority: "Mid",
    experienceYears: 4,
    workMode: "hybrid",
    location: { fr: "Paris (Hybride)", en: "Paris (Hybrid)" } as B,
    status: "open",
    hardSkills: ["Product Management", "Agile/Scrum", "SQL", "Jira"],
    softSkills: { fr: ["Communication", "Leadership", "Orientation résultats"], en: ["Communication", "Leadership", "Results-oriented"] } as B<string[]>,
    firstStep: { fr: "Call RH (30 min)", en: "HR Call (30 min)" } as B,
    steps: {
      fr: ["Call RH (30 min)", "Étude de cas produit (2h)", "Entretien avec l'équipe (1h)", "Offre"],
      en: ["HR Call (30 min)", "Product case study (2h)", "Team interview (1h)", "Offer"],
    } as B<string[]>,
    matchCount: 7,
    newCount: 3,
  },
];

const INIT_CANDIDATES: Candidate[] = [
  {
    id: "c1", jobId: "j1", score: 94, hardScore: 96, softScore: 91,
    roleFit: 96, cultureFit: 92, practicalFit: 94,
    status: "pending_review", bookmarked: true, interviewRequested: false,
    feedbackRequested: ["col2"],
    feedbackEntries: [
      {
        collaborator: MOCK_COLLABORATORS[0],
        rating: 5,
        comment: { fr: "Profil rare — très solide sur le design system. À ne pas rater.", en: "Rare profile — very strong on design system. Not to be missed." },
      },
    ],
    name: "Marie D.", title: "Senior Product Designer",
    seniority: { fr: "Senior (5-8 ans)", en: "Senior (5-8 yrs)" } as B,
    location: "Paris", workMode: "hybrid",
    hardSkills: ["Figma", "UX Design", "UI Design", "Design System", "Prototyping"],
    softSkills: { fr: ["Leadership", "Communication", "Créativité", "Empathie"], en: ["Leadership", "Communication", "Creativity", "Empathy"] } as B<string[]>,
    strengths: { fr: "Créativité, Résolution de problèmes", en: "Creativity, Problem solving" } as B,
    workStyle: { fr: "Autonome & orienté impact", en: "Autonomous & impact-driven" } as B,
    whyMatch: {
      fr: ["Son expérience en design system correspond exactement aux exigences du poste", "Son style de travail autonome s'aligne avec la culture de l'équipe produit", "Localisation Paris — aucune contrainte logistique pour le mode hybride", "Ses ambitions de croissance correspondent aux opportunités offertes"],
      en: ["Her design system experience is an exact match for the role requirements", "Her autonomous work style aligns with the product team culture", "Paris-based — no logistical constraints for hybrid mode", "Her growth ambitions align with the opportunities on offer"],
    } as B<string[]>,
    risks: {
      fr: ["Attentes salariales potentiellement au-delà de la fourchette haute", "Profil très senior, pourrait s'ennuyer sur des tâches d'exécution"],
      en: ["Salary expectations potentially above the upper bracket", "Very senior profile — may find execution tasks underwhelming"],
    } as B<string[]>,
  },
  {
    id: "c2", jobId: "j1", score: 87, hardScore: 89, softScore: 84,
    roleFit: 88, cultureFit: 83, practicalFit: 90,
    status: "pending_review", bookmarked: false, interviewRequested: false,
    feedbackRequested: [],
    feedbackEntries: [],
    name: "Lucas M.", title: "Lead UX Designer",
    seniority: { fr: "Expert (8+ ans)", en: "Expert (8+ yrs)" } as B,
    location: "Lyon", workMode: "remote",
    hardSkills: ["Figma", "UX Design", "UI Design", "UX Research"],
    softSkills: { fr: ["Leadership", "Autonomie", "Esprit critique"], en: ["Leadership", "Autonomy", "Critical thinking"] } as B<string[]>,
    strengths: { fr: "Leadership, Analyse", en: "Leadership, Analysis" } as B,
    workStyle: { fr: "Structuré & orienté data", en: "Structured & data-driven" } as B,
    whyMatch: {
      fr: ["Expertise UX Research rare et très recherchée pour ce poste", "Expérience leadership — capable de monter en responsabilité rapidement", "Disponible full remote, flexibilité géographique appréciée"],
      en: ["Rare UX Research expertise that is highly sought for this role", "Leadership background — able to take on more responsibility quickly", "Available full remote, appreciated geographical flexibility"],
    } as B<string[]>,
    risks: {
      fr: ["Basé à Lyon — présentiel occasionnel pourrait poser problème", "Profil plus senior que requis, risque de surqualification", "Style très structuré peut entrer en tension avec un environnement agile rapide"],
      en: ["Lyon-based — occasional on-site days could be an issue", "More senior than required — overqualification risk", "Highly structured style may clash with a fast agile environment"],
    } as B<string[]>,
  },
  {
    id: "c3", jobId: "j1", score: 78, hardScore: 75, softScore: 82,
    roleFit: 74, cultureFit: 85, practicalFit: 78,
    status: "hired", bookmarked: false, interviewRequested: true,
    feedbackRequested: ["col1", "col2"],
    feedbackEntries: [
      {
        collaborator: MOCK_COLLABORATORS[0],
        rating: 4,
        comment: { fr: "Bon fit culture, à confirmer en entretien.", en: "Good culture fit, to confirm in interview." },
      },
      {
        collaborator: MOCK_COLLABORATORS[1],
        rating: 3,
        comment: { fr: "Design system à creuser — gap possible.", en: "Design system to probe — possible gap." },
      },
    ],
    name: "Sophie K.", title: "Product Designer",
    seniority: { fr: "Senior (5-8 ans)", en: "Senior (5-8 yrs)" } as B,
    location: "Paris", workMode: "hybrid",
    hardSkills: ["Figma", "UX Design", "UI Design"],
    softSkills: { fr: ["Travail en équipe", "Communication", "Adaptabilité"], en: ["Teamwork", "Communication", "Adaptability"] } as B<string[]>,
    strengths: { fr: "Collaboration, Créativité", en: "Collaboration, Creativity" } as B,
    workStyle: { fr: "Collaboratif & bienveillant", en: "Collaborative & caring" } as B,
    whyMatch: {
      fr: ["Excellent culture fit avec les valeurs de bienveillance de l'équipe", "Profil Paris hybride — aucune contrainte logistique", "Forte capacité d'adaptation dans des contextes changeants"],
      en: ["Excellent culture fit with the team's caring values", "Paris hybrid profile — no logistical constraints", "Strong adaptability in changing environments"],
    } as B<string[]>,
    risks: {
      fr: ["Compétences design system à renforcer (manque Prototypage avancé)", "Moins d'expérience en B2B SaaS que les autres candidats"],
      en: ["Design system skills need strengthening (lacks advanced Prototyping)", "Less B2B SaaS experience than other candidates"],
    } as B<string[]>,
  },
  {
    id: "c4", jobId: "j2", score: 91, hardScore: 93, softScore: 88,
    roleFit: 93, cultureFit: 89, practicalFit: 91,
    status: "pending_review", bookmarked: true, interviewRequested: false,
    feedbackRequested: [],
    feedbackEntries: [],
    name: "Thomas B.", title: "Senior Product Manager",
    seniority: { fr: "Mid (2-5 ans)", en: "Mid (2-5 yrs)" } as B,
    location: "Paris", workMode: "hybrid",
    hardSkills: ["Product Management", "Agile/Scrum", "SQL", "Jira", "Analytics"],
    softSkills: { fr: ["Communication", "Leadership", "Orientation résultats"], en: ["Communication", "Leadership", "Results-oriented"] } as B<string[]>,
    strengths: { fr: "Data-driven, Leadership", en: "Data-driven, Leadership" } as B,
    workStyle: { fr: "Orienté résultats & structuré", en: "Results-oriented & structured" } as B,
    whyMatch: {
      fr: ["Maîtrise SQL et Analytics — répond parfaitement aux besoins de la squad Growth", "Style orienté résultats aligné avec la culture de performance de l'équipe", "Expérience Agile/Scrum solide pour piloter les sprints en autonomie", "Paris hybride — disponibilité immédiate"],
      en: ["SQL & Analytics proficiency — perfect fit for the Growth squad's needs", "Results-oriented style aligned with the team's performance culture", "Solid Agile/Scrum background to run sprints autonomously", "Paris hybrid — available immediately"],
    } as B<string[]>,
    risks: {
      fr: ["Expérience mid level, pourrait manquer de recul sur des décisions stratégiques"],
      en: ["Mid-level experience — may lack perspective on strategic decisions"],
    } as B<string[]>,
  },
  {
    id: "c5", jobId: "j2", score: 83, hardScore: 80, softScore: 87,
    roleFit: 79, cultureFit: 90, practicalFit: 82,
    status: "pending_review", bookmarked: false, interviewRequested: false,
    feedbackRequested: [],
    feedbackEntries: [],
    name: "Amina R.", title: "Product Manager",
    seniority: { fr: "Mid (2-5 ans)", en: "Mid (2-5 yrs)" } as B,
    location: "Paris", workMode: "remote",
    hardSkills: ["Product Management", "Agile/Scrum", "Jira"],
    softSkills: { fr: ["Communication", "Empathie", "Adaptabilité"], en: ["Communication", "Empathy", "Adaptability"] } as B<string[]>,
    strengths: { fr: "Empathie, Communication", en: "Empathy, Communication" } as B,
    workStyle: { fr: "Centré utilisateur & collaboratif", en: "User-centric & collaborative" } as B,
    whyMatch: {
      fr: ["Excellent culture fit — profil centré utilisateur correspond aux valeurs produit", "Très forte capacité de communication, essentielle pour aligner les parties prenantes", "Grande adaptabilité dans des environnements en forte croissance"],
      en: ["Excellent culture fit — user-centric profile matches product values", "Very strong communication skills, essential for aligning stakeholders", "High adaptability in fast-growth environments"],
    } as B<string[]>,
    risks: {
      fr: ["Pas de compétences SQL déclarées — gap sur la partie data analytics", "Préférence remote peut limiter la collaboration spontanée avec l'équipe"],
      en: ["No SQL skills listed — gap on the data analytics side", "Remote preference may limit spontaneous collaboration with the team"],
    } as B<string[]>,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getScoreColor = (s: number) => s >= 90 ? "text-emerald-600" : s >= 75 ? "text-emerald-600" : "text-amber-600";
const getScoreBg = (s: number) => s >= 90 ? "bg-emerald-50 border-emerald-200" : s >= 75 ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200";

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className={cn("w-3.5 h-3.5", i <= rating ? "text-amber-400" : "text-gray-200")} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

// ─── Share Pool Modal ─────────────────────────────────────────────────────────

function SharePoolModal({
  jobTitle,
  collaborators,
  onAdd,
  onClose,
  lang,
  d,
}: {
  jobTitle: string;
  collaborators: Collaborator[];
  onAdd: (email: string) => void;
  onClose: () => void;
  lang: "fr" | "en";
  d: Record<string, string>;
}) {
  const [emailInput, setEmailInput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleAdd = () => {
    if (emailInput.trim()) { onAdd(emailInput.trim()); setEmailInput(""); }
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusLabel = (s: string) => lang === "en"
    ? (s === "viewing" ? "Viewing" : "Pending")
    : (s === "viewing" ? "Actif" : "En attente");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up">
        <div className="p-6">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{d.sharePoolTitle}</h2>
              <p className="text-sm text-gray-400 mt-0.5">{jobTitle}</p>
            </div>
            <button type="button" onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all -mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-5">{d.sharePoolSub}</p>

          {/* Add collaborator */}
          <div className="flex gap-2 mb-5">
            <Input
              placeholder={d.addByEmail}
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="text-sm h-9"
            />
            <Button variant="gradient" size="sm" onClick={handleAdd} className="whitespace-nowrap px-4">
              {d.addCollab}
            </Button>
          </div>

          {/* Collaborator list */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{d.sharedWith}</p>
            {collaborators.length === 0 ? (
              <p className="text-sm text-gray-400 py-2">{d.noShared}</p>
            ) : (
              <div className="space-y-2">
                {collaborators.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50">
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0", c.color)}>
                      {c.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.email}</p>
                    </div>
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", c.status === "viewing" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>
                      {statusLabel(c.status)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Copy link */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            <span className="text-xs text-gray-400 truncate flex-1">exp.match/pool/{jobTitle.toLowerCase().replace(/\s+/g, "-").slice(0, 20)}</span>
            <button
              type="button"
              onClick={handleCopy}
              className={cn("text-xs font-semibold px-3 py-1 rounded-lg transition-all flex-shrink-0", copied ? "bg-emerald-100 text-emerald-700" : "bg-violet-100 text-violet-700 hover:bg-violet-200")}
            >
              {copied ? d.linkCopied : d.copyLink}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function ManagerDashboard() {
  const router = useRouter();
  const { t, lang } = useLang();
  const d = t.managerDashboard;
  const yrs = lang === "en" ? "yrs" : "ans";

  const [selectedJob, setSelectedJob] = useState("j1");
  const [candidates, setCandidates] = useState<Candidate[]>(INIT_CANDIDATES);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [filterBookmarked, setFilterBookmarked] = useState(false);

  // Share pool state
  const [shareJobId, setShareJobId] = useState<string | null>(null);
  const [poolCollaborators, setPoolCollaborators] = useState<Record<string, Collaborator[]>>({
    j1: MOCK_COLLABORATORS,
    j2: [MOCK_COLLABORATORS[0]],
  });

  const updateCandidate = (id: string, patch: Partial<Candidate>) =>
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const c = candidates.find((c) => c.id === id);
    if (c) updateCandidate(id, { bookmarked: !c.bookmarked });
  };

  const requestInterview = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateCandidate(id, { interviewRequested: true });
  };

  const requestFeedback = (candidateId: string, collabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const c = candidates.find((c) => c.id === candidateId);
    if (c && !c.feedbackRequested.includes(collabId)) {
      updateCandidate(candidateId, { feedbackRequested: [...c.feedbackRequested, collabId] });
    }
  };

  const addCollaborator = (jobId: string, email: string) => {
    const newCollab: Collaborator = {
      id: `col_${Date.now()}`,
      name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      initials: email.slice(0, 2).toUpperCase(),
      color: ["bg-emerald-400", "bg-orange-400", "bg-teal-400"][Math.floor(Math.random() * 3)],
      status: "pending",
    };
    setPoolCollaborators((prev) => ({ ...prev, [jobId]: [...(prev[jobId] ?? []), newCollab] }));
  };

  const selectedJob_ = MOCK_JOBS.find((j) => j.id === selectedJob);
  const allJobCandidates = candidates.filter((c) => c.jobId === selectedJob);
  const jobCandidates = filterBookmarked ? allJobCandidates.filter((c) => c.bookmarked) : allJobCandidates;
  const bookmarkedCount = allJobCandidates.filter((c) => c.bookmarked).length;
  const currentCollaborators = poolCollaborators[selectedJob] ?? [];

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
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-gradient-to-br from-emerald-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold">EM</div>
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
                <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-sm group-hover:bg-violet-200 transition-colors">JM</div>
                <span className="text-sm text-gray-700 font-medium hidden sm:block group-hover:text-violet-600 transition-colors">{t.nav.myCompany}</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{d.hello} Jean 👋</h1>
          <p className="text-gray-500 mt-1">{d.sub}</p>
        </div>

        {/* Stats */}
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
          {/* ── Jobs list ── */}
          <div className="md:col-span-1 space-y-3">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">{d.openJobs}</h2>
            {MOCK_JOBS.map((job) => (
              <button
                key={job.id}
                type="button"
                onClick={() => { setSelectedJob(job.id); setSelectedCandidate(null); setFilterBookmarked(false); }}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all",
                  selectedJob === job.id ? "border-emerald-500 bg-white shadow-sm" : "border-gray-100 bg-white hover:border-emerald-200"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={cn("font-semibold text-sm", selectedJob === job.id ? "text-emerald-700" : "text-gray-900")}>{job.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{job.seniority} • {job.experienceYears}+ {yrs}</p>
                  </div>
                  {job.newCount > 0 && (
                    <span className="flex-shrink-0 bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
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
                  {pick(job.softSkills, lang).slice(0, 3).map((s) => <Badge key={s} variant="soft" className="text-xs">{s}</Badge>)}
                </div>
              </button>
            ))}
            <Link href="/manager/onboarding">
              <Button variant="outline" size="sm" className="w-full mt-2">{d.createJob}</Button>
            </Link>
          </div>

          {/* ── Candidates panel ── */}
          <div className="md:col-span-2">
            {/* Panel header */}
            <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm font-semibold text-gray-700">
                  {d.matchedProfiles} — {selectedJob_?.title}
                </h2>
                <span className="text-xs text-gray-400">{allJobCandidates.length} {d.profiles}</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Bookmark filter */}
                <button
                  type="button"
                  onClick={() => setFilterBookmarked((v) => !v)}
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all",
                    filterBookmarked
                      ? "bg-amber-50 border-amber-300 text-amber-700"
                      : "bg-white border-gray-200 text-gray-500 hover:border-amber-300"
                  )}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={filterBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                  {filterBookmarked ? `${d.filterBookmarked} (${bookmarkedCount})` : d.filterBookmarked}
                </button>
                {/* Share pool */}
                <button
                  type="button"
                  onClick={() => setShareJobId(selectedJob)}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:text-emerald-600 transition-all"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                  {d.sharePool}
                  {currentCollaborators.length > 0 && (
                    <span className="flex -space-x-1 ml-0.5">
                      {currentCollaborators.slice(0, 3).map((c) => (
                        <span key={c.id} className={cn("w-4 h-4 rounded-full border border-white text-white text-[9px] flex items-center justify-center font-bold", c.color)}>
                          {c.initials[0]}
                        </span>
                      ))}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Candidates */}
            <div className="space-y-3">
              {jobCandidates.map((candidate) => (
                <Card
                  key={candidate.id}
                  className={cn(
                    "shadow-none border cursor-pointer transition-all hover:shadow-md",
                    candidate.status === "rejected" ? "opacity-50" : "",
                    selectedCandidate === candidate.id ? "shadow-md" : ""
                  )}
                  onClick={() => setSelectedCandidate(selectedCandidate === candidate.id ? null : candidate.id)}
                >
                  <CardContent className="pt-4 pb-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                        {candidate.name[0]}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); router.push(`/candidate/profile/${candidate.id}`); }}
                              className="font-bold text-gray-900 hover:text-emerald-600 hover:underline transition-colors"
                            >
                              {candidate.name}
                            </button>
                            <span className="text-sm text-gray-500 ml-1.5">• {candidate.title}</span>
                          </div>

                          {/* Score + bookmark */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className={cn("px-2.5 py-1 rounded-lg border text-sm font-extrabold", getScoreBg(candidate.score))}>
                              <span className={getScoreColor(candidate.score)}>{candidate.score}%</span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => toggleBookmark(candidate.id, e)}
                              className={cn("w-7 h-7 rounded-lg flex items-center justify-center transition-all", candidate.bookmarked ? "text-amber-500 bg-amber-50" : "text-gray-300 hover:text-amber-400 hover:bg-amber-50")}
                              title={candidate.bookmarked ? d.bookmarked : d.bookmark}
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill={candidate.bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-400">{pick(candidate.seniority, lang)}</span>
                          <span className="text-xs text-gray-300">·</span>
                          <span className="text-xs text-gray-400">{candidate.location}</span>
                        </div>

                        {/* Status pills */}
                        {(candidate.status === "rejected" || candidate.interviewRequested || candidate.feedbackRequested.length > 0) && (
                          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                            {candidate.status === "rejected" && <Badge variant="destructive" className="text-xs">{d.rejected}</Badge>}
                            {candidate.interviewRequested && <Badge variant="default" className="text-xs bg-violet-100 text-violet-700 border-violet-200">{d.interviewRequested}</Badge>}
                            {candidate.feedbackRequested.length > 0 && (
                              <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                {candidate.feedbackRequested.length} {d.feedbackRequested}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Skills + strengths — full width, aligned with Match Breakdown */}
                    <div className="mt-5 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
                      <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span className="text-gray-700 font-medium">{d.hardSkills}</span><span>{candidate.hardScore}%</span>
                        </div>
                        <Progress value={candidate.hardScore} className="h-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span className="text-gray-700 font-medium">{d.softSkills}</span><span>{candidate.softScore}%</span>
                        </div>
                        <Progress value={candidate.softScore} className="h-1" />
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1">
                      {candidate.hardSkills.slice(0, 3).map((s) => <Badge key={s} variant="hard" className="text-xs">{s}</Badge>)}
                      {pick(candidate.softSkills, lang).slice(0, 2).map((s) => <Badge key={s} variant="soft" className="text-xs">{s}</Badge>)}
                    </div>

                    {/* Strengths + work style */}
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500 mb-1">{d.strengths}</p>
                        <p className="text-sm font-semibold text-gray-800">{pick(candidate.strengths, lang)}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500 mb-1">{d.workStyle}</p>
                        <p className="text-sm font-semibold text-gray-800">{pick(candidate.workStyle, lang)}</p>
                      </div>
                    </div>

                    {/* ── Expanded panel ── */}
                    {selectedCandidate === candidate.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in-up space-y-4">

                        {/* Match Breakdown */}
                        <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-violet-50/40 border border-violet-100 p-4">
                          <div className="flex items-start justify-between mb-1">
                            <div>
                              <p className="font-bold text-gray-900 text-sm">{d.matchBreakdown}</p>
                              <p className="flex items-center gap-1 text-xs text-violet-500 mt-0.5">
                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                                {d.aiPowered}
                              </p>
                            </div>
                            <span className={cn("text-3xl font-extrabold", getScoreColor(candidate.score))}>{candidate.score}%</span>
                          </div>
                          <div className="space-y-3 mt-4">
                            {[
                              { label: d.roleFit, value: candidate.roleFit, color: "bg-blue-500" },
                              { label: d.cultureFit, value: candidate.cultureFit, color: "bg-emerald-500" },
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

                        {/* Why it works */}
                        <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
                          <p className="flex items-center gap-2 font-bold text-emerald-800 text-sm mb-3">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                            {d.whyMatch}
                          </p>
                          <ul className="space-y-1.5">
                            {pick(candidate.whyMatch, lang).map((point, i) => (
                              <li key={i} className="flex gap-2 text-sm text-emerald-900">
                                <span className="text-emerald-400 mt-0.5 shrink-0">•</span>{point}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Risks */}
                        {pick(candidate.risks, lang).length > 0 && (
                          <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4">
                            <p className="flex items-center gap-2 font-bold text-amber-800 text-sm mb-3">
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                              {d.potentialRisks}
                            </p>
                            <ul className="space-y-1.5">
                              {pick(candidate.risks, lang).map((risk, i) => (
                                <li key={i} className="flex gap-2 text-sm text-amber-900">
                                  <span className="text-amber-400 mt-0.5 shrink-0">•</span>{risk}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="border-t border-gray-100" />

                        {/* ── Collaborator feedback ── */}
                        <div className="rounded-2xl bg-white border border-gray-100 p-4">
                          <p className="text-sm font-bold text-gray-900 mb-3">{d.collaboratorFeedback}</p>

                          {/* Existing feedback */}
                          {candidate.feedbackEntries.length > 0 ? (
                            <div className="space-y-3 mb-3">
                              {candidate.feedbackEntries.map((entry, i) => (
                                <div key={i} className="flex gap-3 p-3 bg-white rounded-xl">
                                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0", entry.collaborator.color)}>
                                    {entry.collaborator.initials}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-xs font-semibold text-gray-700">{entry.collaborator.name}</span>
                                      <StarRating rating={entry.rating} />
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed">{pick(entry.comment, lang)}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400 mb-3">{d.noFeedback}</p>
                          )}

                          {/* Ask for feedback from collaborators */}
                          {currentCollaborators.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs text-gray-500">{d.askFeedback} :</span>
                              {currentCollaborators.map((collab) => {
                                const alreadyRequested = candidate.feedbackRequested.includes(collab.id);
                                const alreadyFeedback = candidate.feedbackEntries.some((e) => e.collaborator.id === collab.id);
                                return (
                                  <button
                                    key={collab.id}
                                    type="button"
                                    disabled={alreadyRequested || alreadyFeedback}
                                    onClick={(e) => requestFeedback(candidate.id, collab.id, e)}
                                    title={collab.name}
                                    className={cn(
                                      "w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 transition-all",
                                      alreadyFeedback ? "border-emerald-300 opacity-60 cursor-default" : alreadyRequested ? "border-emerald-300 opacity-60 cursor-default" : "border-transparent hover:scale-110 hover:border-white hover:shadow-md cursor-pointer",
                                      collab.color
                                    )}
                                  >
                                    {alreadyFeedback ? "✓" : alreadyRequested ? "…" : collab.initials}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* ── Interview request ── */}
                        <div className="rounded-2xl border border-gray-100 bg-white p-4">
                          <div className="flex items-center justify-between gap-3 mb-4">
                            <p className="text-sm font-bold text-gray-900">{d.requestInterview}</p>
                            {!candidate.interviewRequested && (
                              <Button
                                variant="gradient"
                                size="sm"
                                className="whitespace-nowrap flex-shrink-0"
                                onClick={(e) => requestInterview(candidate.id, e)}
                              >
                                {d.requestInterview} →
                              </Button>
                            )}
                          </div>
                          {/* Process steps */}
                          <ol className="space-y-2">
                            {pick(selectedJob_?.steps ?? { fr: [], en: [] }, lang).map((step, i) => {
                              const isActive = i === 0 && candidate.interviewRequested;
                              const isDone = false;
                              return (
                                <li key={i} className="flex items-start gap-3">
                                  <div className={cn(
                                    "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5",
                                    isActive ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400"
                                  )}>
                                    {isDone ? "✓" : i + 1}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={cn("text-sm", isActive ? "font-semibold text-gray-900" : "text-gray-500")}>{step}</p>
                                    {isActive && (
                                      <p className="text-xs text-emerald-600 mt-0.5">
                                        {lang === "fr" ? "Entretien demandé ✓" : "Interview requested ✓"}
                                      </p>
                                    )}
                                  </div>
                                </li>
                              );
                            })}
                          </ol>
                        </div>

                        {/* Actions */}
                        {candidate.status === "pending_review" && (
                          <div className="flex items-center justify-between gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); updateCandidate(candidate.id, { status: "rejected" }); setSelectedCandidate(null); }}
                              className="text-gray-500"
                            >
                              {d.notRetained}
                            </Button>
                            <div className="flex items-center gap-3">
                              <Link
                                href={`/candidate/profile/${candidate.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-sm text-gray-900 font-medium hover:underline"
                              >
                                {d.viewFullProfile}
                              </Link>
                              <button
                                type="button"
                                onClick={(e) => toggleBookmark(candidate.id, e)}
                                className={cn(
                                  "flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all",
                                  candidate.bookmarked ? "bg-amber-50 border-amber-300 text-amber-700" : "bg-white border-gray-200 text-gray-500 hover:border-amber-300"
                                )}
                              >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill={candidate.bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                                {candidate.bookmarked ? d.bookmarked : d.bookmark}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {jobCandidates.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                  <div className="text-4xl mb-3">{filterBookmarked ? "🔖" : "🔍"}</div>
                  <p className="font-medium">{filterBookmarked ? `0 ${d.filterBookmarked}` : d.noProfiles}</p>
                  {!filterBookmarked && <p className="text-xs mt-1">{d.scanning}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Share pool modal */}
      {shareJobId && (
        <SharePoolModal
          jobTitle={MOCK_JOBS.find((j) => j.id === shareJobId)?.title ?? ""}
          collaborators={poolCollaborators[shareJobId] ?? []}
          onAdd={(email) => addCollaborator(shareJobId, email)}
          onClose={() => setShareJobId(null)}
          lang={lang}
          d={d as unknown as Record<string, string>}
        />
      )}
    </div>
  );
}
