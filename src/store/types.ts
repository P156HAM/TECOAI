export interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  estimatedDuration: string;
  sourceNode: string;
  subject: string;
  status: "draft" | "active";
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  subject: string;
  status: "draft" | "active" | "archived";
}

export interface RootState {
  projects: ProjectsState;
  assessments: AssessmentsState;
}

export interface ProjectsState {
  items: Record<string, Project>;
  loading: boolean;
  error: string | null;
}

export interface AssessmentsState {
  items: Record<string, Assessment>;
  loading: boolean;
  error: string | null;
}
