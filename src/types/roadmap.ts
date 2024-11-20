export interface VideoResource {
  title: string;
  url: string;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "children";
}

export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  resources: {
    title: string;
    url: string;
  }[];
  videos: VideoResource[];
  dependencies: string[];
  completed: boolean;
  practicePrompt: string;
}

export interface UserProgress {
  completedNodes: string[];
  totalNodes: number;
  currentLevel: number;
  xpPoints: number;
}
