import React, { createContext, useContext, useState } from "react";
import { ProjectIdea } from "@/types/roadmap";

interface ProjectWithMetadata extends ProjectIdea {
  id: string;
  sourceNode: string;
  subject: string;
  status: "draft" | "in-progress" | "completed";
}

interface ProjectContextType {
  projects: ProjectWithMetadata[];
  addProject: (project: ProjectWithMetadata) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<ProjectWithMetadata[]>(() => {
    const saved = localStorage.getItem("projects");
    return saved ? JSON.parse(saved) : [];
  });

  const addProject = (project: ProjectWithMetadata) => {
    setProjects((prev) => {
      const newProjects = [...prev, project];
      localStorage.setItem("projects", JSON.stringify(newProjects));
      return newProjects;
    });
  };

  return (
    <ProjectContext.Provider value={{ projects, addProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
}
