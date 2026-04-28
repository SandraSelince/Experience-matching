import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function computeMatchScore(
  candidateSkills: { name: string; level: number }[],
  jobSkills: { name: string; level: number; required: boolean }[]
): number {
  if (jobSkills.length === 0) return 0;

  let totalWeight = 0;
  let matchedWeight = 0;

  for (const jobSkill of jobSkills) {
    const weight = jobSkill.required ? 2 : 1;
    totalWeight += weight;

    const candidateSkill = candidateSkills.find(
      (s) => s.name.toLowerCase() === jobSkill.name.toLowerCase()
    );

    if (candidateSkill) {
      const levelMatch = Math.min(candidateSkill.level / jobSkill.level, 1);
      matchedWeight += weight * levelMatch;
    }
  }

  return Math.round((matchedWeight / totalWeight) * 100);
}
