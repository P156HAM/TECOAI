import { useRef, useState } from "react";
import { ChatOpenAI } from "@langchain/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  deleteProject,
  updateProject,
  markAsActive,
} from "@/store/slices/projectsSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  CircleIcon,
  BookOpen,
  FileEdit,
  AlertCircle,
  Trash2,
  Pencil,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createSelector } from "@reduxjs/toolkit";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LoadingSpinner } from "@/components/ui/loadingSpinner";

// to do: create content when the user clicks on create content
// to do: create assessment when the user clicks on create assessment, the assessment should be created and extracted to assessment instead of the resource Hub page.
// to do: the button should dissapear when the content is generated and a new button should appear to create assessment
// to do: create a button to delete the project or mark it as not draft anymore.
// fix the scheme because the AI is creating an object instead of an array.

type Project = {
  id: string;
  title: string;
  subject: string;
  description: string;
  difficulty: string;
  estimatedDuration: string;
  sourceNode: string;
  status: string;
};

const selectProjects = createSelector(
  (state: RootState) => state.projects.items,
  (items) => Object.values(items)
);

export function Projects() {
  // must fix rerender issue.
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projects = useSelector(selectProjects);
  const [t] = useTranslation("global");
  const [generatedContent, setGeneratedContent] = useState<Record<string, any>>(
    {}
  );
  const generatedContentRef = useRef<Record<string, any>>({});
  const [generatingProjectId, setGeneratingProjectId] = useState<string | null>(
    null
  );
  const [isGeneratingAssessment, setIsGeneratingAssessment] = useState<
    string | null
  >(null);

  useEffect(() => {
    console.log(t("projects.title"));
  }, []);

  const handleDeleteProject = (projectId: string) => {
    dispatch(deleteProject(projectId));
  };

  const handleUpdateProjectStatus = async (project: Project) => {
    try {
      dispatch(markAsActive(project.id));
      // TODO: Implement Firestore sync later
    } catch (error) {
      console.error("Error updating project status:", error);
    }
  };

  const generateProjectContent = async (project: Project) => {
    setGeneratingProjectId(project.id);
    try {
      const llm = new ChatOpenAI({
        modelName: "gpt-4",
        temperature: 0,
        openAIApiKey: import.meta.env.VITE_OPEN_AI_API_KEY,
      });

      const parser = StructuredOutputParser.fromZodSchema(
        z.object({
          projectTitle: z.string(),
          subject: z.string(),
          description: z.string(),
          difficultyLevel: z.string(),
          duration: z.string(),
          sourceTopic: z.string(),
          learningObjectives: z.array(z.string()),
          assessmentCriteria: z.array(z.string()),
          teachingGuidelines: z.array(z.string()),
        })
      );

      const response = await llm.invoke([
        {
          role: "system",
          content: `You are an expert educational content creator. Create a detailed project plan based on the given project information.
          
          Your response MUST follow this exact JSON structure:
          {
            "projectTitle": "string",
            "subject": "string",
            "description": "string",
            "difficultyLevel": "string",
            "duration": "string",
            "sourceTopic": "string",
            "learningObjectives": [
              "string",
              "string",
              "string"
            ],
            "assessmentCriteria": [
              "string",
              "string",
              "string"
            ],
            "teachingGuidelines": [
              "string",
              "string",
              "string"
            ]
          }

          Important:
          1. ALL arrays must be arrays of strings, not objects
          2. Do not include any additional fields
          3. Return only the raw JSON without any markdown formatting or code blocks`,
        },
        {
          role: "user",
          content: `Create a detailed project plan for:
          Title: ${project.title}
          Subject: ${project.subject}
          Description: ${project.description}
          Difficulty: ${project.difficulty}
          Duration: ${project.estimatedDuration}
          Source Topic: ${project.sourceNode}`,
        },
      ]);

      console.log("AI Response:", response.content);

      const cleanContent = (response.content as string)
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .replace(/,(\s*[}\]])/g, "$1")
        .trim();

      let parsedContent;
      try {
        parsedContent = await parser.parse(cleanContent);
      } catch (parseError) {
        console.error("Parsing error:", parseError);
        throw new Error("Invalid response format from AI.");
      }

      dispatch(markAsActive(project.id));

      generatedContentRef.current[project.id] = parsedContent;
      setGeneratedContent({ ...generatedContentRef.current });
      console.log(
        "Updated Generated Content (Ref):",
        generatedContentRef.current
      );
    } catch (error) {
      console.error("Error generating project content:", error);
    } finally {
      setGeneratingProjectId(null);
    }
  };

  useEffect(() => {
    console.log("Generated Content:", generatedContent);
  }, [generatedContent]);

  const handleCreateAssessment = async (project: Project) => {
    setIsGeneratingAssessment(project.id);
    try {
      // TODO: Implement assessment generation logic
      console.log("Creating assessment for project:", project.id);
    } finally {
      setIsGeneratingAssessment(null);
    }
  };

  // Split projects into draft and active
  const draftProjects = projects.filter(
    (project) => project.status === "draft"
  );
  const activeProjects = projects.filter(
    (project) => project.status === "active"
  );

  return (
    <div className="container mx-auto py-8 space-y-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("projects.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and create your educational projects
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
            <div className="flex items-center gap-1.5">
              <FileEdit className="h-4 w-4 text-foreground" />
              <span className="font-medium text-foreground">
                {draftProjects.length}
              </span>
            </div>
            <span className="text-sm text-foreground">Draft Projects</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-foreground" />
              <span className="font-medium text-foreground">
                {activeProjects.length}
              </span>
            </div>
            <span className="text-sm text-foreground">Active Projects</span>
          </div>
        </div>
      </header>

      {/* Draft Projects Section */}
      {draftProjects.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-foreground">
            <FileEdit className="h-5 w-5 text-muted-foreground" />
            Draft Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {draftProjects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-foreground">
                      {project.title}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="bg-muted">
                        Draft
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <Trash2 className="h-4 w-4" color="#ef4444" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t("projects.from")}: {project.sourceNode}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {generatedContent[project.id] ? (
                    <>
                      <div>
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-sm text-muted-foreground">
                          {generatedContent[project.id].description}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">
                          Learning Objectives
                        </h4>
                        <ul className="list-disc pl-4 text-sm space-y-1">
                          {generatedContent[project.id].learningObjectives
                            .slice(0, 3)
                            .map((objective: string, i: number) => (
                              <li key={i} className="text-muted-foreground">
                                {objective}
                              </li>
                            ))}
                        </ul>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleUpdateProjectStatus(project)}
                        >
                          Mark Active
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() =>
                            navigate(`/edit-project/${project.id}`)
                          }
                        >
                          Edit Project
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-foreground line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{project.subject}</Badge>
                        <Badge variant="secondary">{project.difficulty}</Badge>
                        <Badge variant="secondary">
                          {project.estimatedDuration}
                        </Badge>
                      </div>
                      <Button
                        className="flex-1"
                        onClick={() => generateProjectContent(project)}
                        disabled={generatingProjectId === project.id}
                      >
                        {generatingProjectId === project.id ? (
                          <>
                            <LoadingSpinner />
                            Generating...
                          </>
                        ) : (
                          "Generate Content"
                        )}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Active Projects Section */}
      {activeProjects.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            Active Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeProjects.map((project) => (
              <Card
                key={project.id}
                className="dark:bg-card hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-foreground">
                      {project.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <CircleIcon className="h-2 w-2 fill-green-500 text-green-500 animate-pulse" />
                      <Badge
                        variant="outline"
                        className="bg-green-500/10 text-green-500"
                      >
                        Active
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t("projects.from")}: {project.sourceNode}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Learning Objectives</AccordionTrigger>
                        <AccordionContent>
                          <ul className="list-disc pl-4 text-sm space-y-1">
                            {generatedContent[project.id]?.learningObjectives
                              ?.slice(0, 3)
                              .map((objective: string, i: number) => (
                                <li key={i} className="text-muted-foreground">
                                  {objective}
                                </li>
                              )) || <li>No learning objectives available.</li>}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>Assessment Criteria</AccordionTrigger>
                        <AccordionContent>
                          <ul className="list-disc pl-4 text-sm space-y-1">
                            {generatedContent[project.id]?.assessmentCriteria
                              ?.slice(0, 3)
                              .map((objective: string, i: number) => (
                                <li key={i} className="text-muted-foreground">
                                  {objective}
                                </li>
                              )) || <li>No learning objectives available.</li>}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>Teaching Guidelines</AccordionTrigger>
                        <AccordionContent>
                          <ul className="list-disc pl-4 text-sm space-y-1">
                            {generatedContent[project.id]?.teachingGuidelines
                              ?.slice(0, 3)
                              .map((objective: string, i: number) => (
                                <li key={i} className="text-muted-foreground">
                                  {objective}
                                </li>
                              )) || <li>No learning objectives available.</li>}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{project.subject}</Badge>
                    <Badge variant="secondary">{project.difficulty}</Badge>
                    <Badge variant="secondary">
                      {project.estimatedDuration}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => handleCreateAssessment(project)}
                      disabled={isGeneratingAssessment === project.id}
                    >
                      {isGeneratingAssessment === project.id
                        ? "Creating..."
                        : "Create Assessment"}
                    </Button>
                    <div className="flex gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            onClick={() => handleUpdateProjectStatus(project)}
                          >
                            <CheckCircle className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Mark as complete</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            onClick={() =>
                              navigate(`/edit-project/${project.id}`)
                            }
                          >
                            <Pencil className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit Project</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {projects.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/25 p-8">
          <AlertCircle className="h-16 w-16 text-muted-foreground/70 animate-pulse mb-6" />
          <h3 className="text-2xl font-semibold text-primary mb-3">
            {t("projects.noProjects")}
          </h3>
          <p className="text-muted-foreground text-center max-w-md mb-8">
            Start your learning journey by creating your first project. Turn
            your learning objectives into actionable projects.
          </p>
          <Button
            size="lg"
            className="gap-2"
            onClick={() => navigate("/lesson-planner")}
          >
            <FileEdit className="h-5 w-5" />
            Create Your First Project
          </Button>
        </div>
      )}
    </div>
  );
}
