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

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-foreground">
        {t("projects.title")}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="dark:bg-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg text-foreground">
                  {project.title}
                </CardTitle>
                <Badge variant="outline">{project.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("projects.from")}: {project.sourceNode} ({project.subject})
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4 text-foreground">
                {project.description}
              </p>
              <div className="flex gap-2 mb-4">
                <Badge variant="secondary">{project.difficulty}</Badge>
                <Badge variant="secondary">{project.estimatedDuration}</Badge>
              </div>
              <div className="flex gap-2 mt-4">
                {!generatedContent[project.id] ? (
                  <Button
                    onClick={() => generateProjectContent(project)}
                    disabled={generatingProjectId === project.id}
                  >
                    {generatingProjectId === project.id
                      ? "Generating..."
                      : "Generate Content"}
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => handleCreateAssessment(project)}
                      disabled={isGeneratingAssessment === project.id}
                    >
                      {isGeneratingAssessment === project.id
                        ? "Creating..."
                        : "Create Assessment"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleUpdateProjectStatus(project, false)}
                    >
                      Mark as Complete
                    </Button>
                  </>
                )}
              </div>

              {generatedContent[project.id] && (
                <div className="mt-4 space-y-4">
                  <h3 className="font-bold">
                    {generatedContent[project.id].projectTitle}
                  </h3>
                  <p>{generatedContent[project.id].description}</p>

                  <div>
                    <h4 className="font-semibold">Learning Objectives:</h4>
                    <ul className="list-disc pl-4">
                      {Object.values(
                        generatedContent[project.id].learningObjectives
                      ).map((objective: unknown, i) => (
                        <li key={i}>{objective as string}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold">Project Steps:</h4>
                    {generatedContent[project.id].projectSteps.map(
                      (
                        steps: {
                          step1: string;
                          step2: string;
                          step3: string;
                          step4: string;
                          step5: string;
                          step6?: string;
                        },
                        i: number
                      ) => (
                        <div key={i} className="space-y-2">
                          <p>{steps.step1}</p>
                          <p>{steps.step2}</p>
                          <p>{steps.step3}</p>
                          <p>{steps.step4}</p>
                          <p>{steps.step5}</p>
                          {steps.step6 && <p>{steps.step6}</p>}
                        </div>
                      )
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold">Assessment Criteria:</h4>
                    <ul className="list-disc pl-4">
                      {Object.values(
                        generatedContent[project.id].assessmentCriteria
                      ).map((criterion: unknown, i) => (
                        <li key={i}>{criterion as string}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {projects.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            {t("projects.noProjects")}
          </div>
        )}
      </div>
    </div>
  );
}
