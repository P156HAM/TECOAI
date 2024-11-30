import { useState } from "react";
import { ChatOpenAI } from "@langchain/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { useProjects } from "@/contexts/ProjectContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CircleIcon, BookOpen, FileEdit, AlertCircle } from "lucide-react";

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

export function Projects() {
  const { projects } = useProjects();
  const [t] = useTranslation("global");
  const [generatedContent, setGeneratedContent] = useState<Record<string, any>>(
    {}
  );
  const [generatingProjectId, setGeneratingProjectId] = useState<string | null>(
    null
  );
  const [isGeneratingAssessment, setIsGeneratingAssessment] = useState<
    string | null
  >(null);

  useEffect(() => {
    console.log(t("projects.title"));
  }, []);

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
          projectSteps: z.array(
            z.object({
              step1: z.string(),
              step2: z.string(),
              step3: z.string(),
              step4: z.string(),
              step5: z.string(),
              step6: z.string().optional(),
            })
          ),
          learningObjectives: z.array(z.string()),
          assessmentCriteria: z.array(z.string()),
          teachingGuidelines: z.array(z.string()),
          commonChallenges: z.array(z.string()),
          extendedLearningOpportunities: z.array(z.string()),
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
            "projectSteps": [
              {
                "step1": "string",
                "step2": "string",
                "step3": "string",
                "step4": "string",
                "step5": "string"
              }
            ],
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
            ],
            "commonChallenges": [
              "string",
              "string",
              "string"
            ],
            "extendedLearningOpportunities": [
              "string",
              "string",
              "string"
            ]
          }

          Important:
          1. ALL arrays must be arrays of strings, not objects
          2. projectSteps must be an array containing one object with step1 through step5
          3. Do not include any additional fields
          4. Return only the raw JSON without any markdown formatting or code blocks`,
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

      const cleanContent = (response.content as string)
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .replace(/,(\s*[}\]])/g, "$1")
        .trim();

      const parsedContent = await parser.parse(cleanContent);
      setGeneratedContent((prev) => ({
        ...prev,
        [project.id]: parsedContent,
      }));
    } catch (error) {
      console.error("Error generating project content:", error);
    } finally {
      setGeneratingProjectId(null);
    }
  };

  const handleCreateAssessment = async (project: Project) => {
    setIsGeneratingAssessment(project.id);
    try {
      // TODO: Implement assessment generation logic
      console.log("Creating assessment for project:", project.id);
    } finally {
      setIsGeneratingAssessment(null);
    }
  };

  const handleUpdateProjectStatus = async (
    project: Project,
    isDraft: boolean
  ) => {
    try {
      // TODO: Implement status update logic
      console.log("Updating project status:", project.id, isDraft);
    } catch (error) {
      console.error("Error updating project status:", error);
    }
  };

  // Split projects into draft and active
  const draftProjects = projects.filter(
    (project) => !generatedContent[project.id]
  );
  const activeProjects = projects.filter(
    (project) => generatedContent[project.id]
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
        <div className="flex gap-2 items-center">
          <Badge variant="secondary" className="gap-1">
            <FileEdit className="h-3 w-3" />
            {draftProjects.length} Drafts
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <BookOpen className="h-3 w-3" />
            {activeProjects.length} Active
          </Badge>
        </div>
      </header>

      {/* Draft Projects Section */}
      {draftProjects.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileEdit className="h-5 w-5 text-muted-foreground" />
            Draft Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {draftProjects.map((project) => (
              <Card
                key={project.id}
                className="dark:bg-card hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-foreground">
                      {project.title}
                    </CardTitle>
                    <Badge variant="outline" className="bg-muted">
                      Draft
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t("projects.from")}: {project.sourceNode}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
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
                    className="w-full"
                    onClick={() => generateProjectContent(project)}
                    disabled={generatingProjectId === project.id}
                  >
                    {generatingProjectId === project.id ? (
                      <>
                        <span className="animate-spin mr-2">⚡</span>
                        Generating...
                      </>
                    ) : (
                      "Generate Content"
                    )}
                  </Button>
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
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{project.subject}</Badge>
                      <Badge variant="secondary">{project.difficulty}</Badge>
                      <Badge variant="secondary">
                        {project.estimatedDuration}
                      </Badge>
                    </div>
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
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleUpdateProjectStatus(project, false)}
                    >
                      Mark Complete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {projects.length === 0 && (
        <div className="text-center py-12 space-y-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="text-lg font-semibold">{t("projects.noProjects")}</h3>
          <p className="text-muted-foreground">
            Create your first project to get started
          </p>
        </div>
      )}
    </div>
  );
}
