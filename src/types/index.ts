export type UserRole = "candidate" | "manager";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  createdAt: Date;
}

export interface Skill {
  name: string;
  level: number; // 1-5
  category: "hard" | "soft";
}

export interface CandidateProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  title: string;
  location: string;
  bio: string;
  cvFileName?: string;
  skills: Skill[];
  careerExpectations: CareerExpectations;
  psychProfile?: PsychProfile;
  status: "draft" | "validated";
}

export interface CareerExpectations {
  desiredRoles: string[];
  seniority: string;
  workMode: "remote" | "hybrid" | "onsite";
  salaryMin?: number;
  salaryMax?: number;
  industries: string[];
}

export interface PsychProfile {
  dominantStrengths: string[];
  workStyle: string;
  leadershipStyle: string;
  motivators: string[];
  scores: Record<string, number>;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  location: string;
  website?: string;
  description: string;
  logoUrl?: string;
}

export interface ManagerProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  title: string;
  company: Company;
  linkedinUrl?: string;
  bio: string;
}

export interface JobPosting {
  id: string;
  managerId: string;
  companyId: string;
  title: string;
  seniority: string;
  experienceYears: number;
  description: string;
  workMode: "remote" | "hybrid" | "onsite";
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  requiredSkills: { name: string; level: number; required: boolean; category: "hard" | "soft" }[];
  status: "open" | "closed";
  createdAt: Date;
}

export interface Match {
  id: string;
  candidateId: string;
  jobId: string;
  score: number;
  hardSkillScore: number;
  softSkillScore: number;
  status: "pending" | "candidate_accepted" | "candidate_declined" | "manager_reviewing" | "hired" | "rejected";
  createdAt: Date;
}

export interface QuestionnaireAnswer {
  questionId: string;
  value: string | number | string[];
}
