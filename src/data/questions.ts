export interface Question {
  id: string;
  type: "scale" | "choice" | "multi" | "scenario";
  category: "strengths" | "work_style" | "leadership" | "motivation" | "collaboration";
  text: string;
  subtitle?: string;
  emoji?: string;
  options?: { label: string; value: string; emoji?: string }[];
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
}

export const psychQuestions: Question[] = [
  // --- STRENGTHS ---
  {
    id: "q1",
    type: "multi",
    category: "strengths",
    emoji: "✨",
    text: "Quelles situations te donnent le plus d'énergie au travail ?",
    subtitle: "Choisis jusqu'à 3 réponses",
    options: [
      { label: "Résoudre des problèmes complexes", value: "problem_solving", emoji: "🧩" },
      { label: "Créer et innover", value: "creativity", emoji: "💡" },
      { label: "Aider et accompagner les autres", value: "helping", emoji: "🤝" },
      { label: "Analyser des données", value: "analysis", emoji: "📊" },
      { label: "Organiser et planifier", value: "organizing", emoji: "📋" },
      { label: "Présenter et convaincre", value: "presenting", emoji: "🎤" },
    ],
  },
  {
    id: "q2",
    type: "choice",
    category: "strengths",
    emoji: "🦁",
    text: "Face à un défi inattendu, quelle est ta première réaction ?",
    options: [
      { label: "J'analyse calmement la situation avant d'agir", value: "analytical", emoji: "🔍" },
      { label: "Je cherche immédiatement des solutions créatives", value: "creative", emoji: "🎨" },
      { label: "Je consulte mon équipe pour avancer ensemble", value: "collaborative", emoji: "👥" },
      { label: "Je structure un plan d'action précis", value: "structured", emoji: "🗂️" },
    ],
  },
  // --- WORK STYLE ---
  {
    id: "q3",
    type: "scale",
    category: "work_style",
    emoji: "⚡",
    text: "Comment travailles-tu le mieux ?",
    minLabel: "Seul(e), en autonomie totale",
    maxLabel: "En équipe, en collaboration constante",
    min: 1,
    max: 5,
  },
  {
    id: "q4",
    type: "choice",
    category: "work_style",
    emoji: "🗓️",
    text: "Quel environnement de travail te correspond le mieux ?",
    options: [
      { label: "Missions structurées avec des objectifs clairs", value: "structured", emoji: "🎯" },
      { label: "Liberté totale pour explorer et expérimenter", value: "exploratory", emoji: "🚀" },
      { label: "Mix entre cadre et flexibilité", value: "balanced", emoji: "⚖️" },
      { label: "Environnement en évolution rapide", value: "fast_paced", emoji: "⚡" },
    ],
  },
  {
    id: "q5",
    type: "scale",
    category: "work_style",
    emoji: "🔋",
    text: "Quel est ton niveau de confort face à l'ambiguïté ?",
    minLabel: "J'ai besoin de clarté et de process",
    maxLabel: "Je m'épanouis dans l'incertitude",
    min: 1,
    max: 5,
  },
  // --- LEADERSHIP ---
  {
    id: "q6",
    type: "choice",
    category: "leadership",
    emoji: "🌟",
    text: "Dans un projet de groupe, quel rôle prends-tu naturellement ?",
    options: [
      { label: "Le leader qui fédère et décide", value: "leader", emoji: "👑" },
      { label: "L'expert qui apporte des solutions", value: "expert", emoji: "🔬" },
      { label: "Le facilitateur qui harmonise l'équipe", value: "facilitator", emoji: "🌉" },
      { label: "L'exécutant fiable qui avance", value: "executor", emoji: "⚙️" },
    ],
  },
  {
    id: "q7",
    type: "scenario",
    category: "leadership",
    emoji: "🤔",
    text: "Ton équipe est divisée sur une décision importante. Tu...",
    options: [
      { label: "Tranches rapidement pour avancer", value: "decisive", emoji: "⚡" },
      { label: "Facilites un consensus collectif", value: "consensus", emoji: "🤝" },
      { label: "Présentes les données et laisses décider", value: "data_driven", emoji: "📊" },
      { label: "Escalades à la hiérarchie", value: "escalate", emoji: "📤" },
    ],
  },
  // --- MOTIVATION ---
  {
    id: "q8",
    type: "multi",
    category: "motivation",
    emoji: "🔥",
    text: "Qu'est-ce qui te motive le plus dans ton travail ?",
    subtitle: "Choisis jusqu'à 3 réponses",
    options: [
      { label: "L'impact sur les utilisateurs / clients", value: "impact", emoji: "🎯" },
      { label: "L'apprentissage continu", value: "learning", emoji: "📚" },
      { label: "La reconnaissance et la progression", value: "recognition", emoji: "🏆" },
      { label: "La qualité et l'excellence", value: "quality", emoji: "💎" },
      { label: "La mission de l'entreprise", value: "mission", emoji: "🌍" },
      { label: "L'autonomie et la liberté", value: "autonomy", emoji: "🦅" },
    ],
  },
  {
    id: "q9",
    type: "scale",
    category: "motivation",
    emoji: "🎯",
    text: "À quel point es-tu orienté(e) résultats vs processus ?",
    minLabel: "Je me concentre sur les résultats finaux",
    maxLabel: "Je soigne chaque étape du processus",
    min: 1,
    max: 5,
  },
  // --- COLLABORATION ---
  {
    id: "q10",
    type: "choice",
    category: "collaboration",
    emoji: "💬",
    text: "Comment gères-tu les retours critiques sur ton travail ?",
    options: [
      { label: "Je les accueille comme une opportunité de progresser", value: "growth", emoji: "🌱" },
      { label: "Je les analyse froidement pour les évaluer", value: "analytical", emoji: "🔍" },
      { label: "J'en discute pour mieux comprendre", value: "discussion", emoji: "💬" },
      { label: "Ça me challenge et me pousse à me dépasser", value: "challenge", emoji: "💪" },
    ],
  },
  {
    id: "q11",
    type: "scale",
    category: "collaboration",
    emoji: "🌐",
    text: "Ton niveau d'aisance dans les environnements multiculturels ?",
    minLabel: "Je préfère un contexte homogène",
    maxLabel: "Je m'épanouis dans la diversité",
    min: 1,
    max: 5,
  },
  {
    id: "q12",
    type: "multi",
    category: "collaboration",
    emoji: "🚀",
    text: "Quelles sont tes valeurs professionnelles fondamentales ?",
    subtitle: "Choisis jusqu'à 3 réponses",
    options: [
      { label: "Intégrité et transparence", value: "integrity", emoji: "🔒" },
      { label: "Innovation et créativité", value: "innovation", emoji: "💡" },
      { label: "Bienveillance et entraide", value: "kindness", emoji: "❤️" },
      { label: "Performance et excellence", value: "performance", emoji: "🏆" },
      { label: "Équilibre vie pro/perso", value: "balance", emoji: "⚖️" },
      { label: "Impact et responsabilité", value: "impact", emoji: "🌍" },
    ],
  },
];

export const TOTAL_STEPS = 5; // onboarding steps
export const MATCH_THRESHOLD = 70;
