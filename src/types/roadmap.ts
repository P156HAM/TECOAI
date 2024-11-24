export type ResourceType =
  | "video"
  | "article"
  | "exercise"
  | "documentation"
  | "tutorial";

export interface TeachingResource {
  title: string;
  url: string;
  type: ResourceType;
  duration?: string;
  difficulty?: "easy" | "medium" | "hard";
}

export interface ProjectIdea {
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  groupSize: number;
  materials: string[];
  estimatedDuration: string;
  learningObjectives: string[];
}

export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  learningObjectives: string[];
  teachingStrategies: string[];
  projectIdeas: ProjectIdea[];
  resources: TeachingResource[];
  studentMotivationTips: string[];
  commonMisconceptions: string[];
  differentiationStrategies: string[];
  assessmentIdeas: {
    type: "quiz" | "project" | "presentation" | "homework";
    description: string;
    rubric?: string[];
  }[];
  dependencies: string[];
  completed: boolean;
  videos: {
    title: string;
    url: string;
    duration: string;
  }[];
  subject: string;
}

export interface UserProgress {
  completedNodes: string[];
  totalNodes: number;
  currentLevel: number;
  xpPoints: number;
}
