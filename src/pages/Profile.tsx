import { useState } from "react";
import { ChatOpenAI } from "@langchain/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { RoadmapNode as RoadmapNodeType } from "@/types/roadmap";
import { ProgressDashboard } from "@/components/ProgressDashboard";
import { RoadmapNode } from "@/components/RoadmapNode";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormData {
  programmingLanguage: string;
  experienceLevel: "beginner" | "intermediate" | "advanced" | "children";
  learningGoal: string;
  timeCommitment: string;
}

export default function Profile() {
  const [formData, setFormData] = useState<FormData>({
    programmingLanguage: "",
    experienceLevel: "beginner",
    learningGoal: "",
    timeCommitment: "",
  });
  const [roadmap, setRoadmap] = useState<RoadmapNodeType[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({
    completedNodes: [],
    totalNodes: 0,
    currentLevel: 1,
    xpPoints: 0,
  });

  const generateRoadmap = async () => {
    setLoading(true);
    try {
      const llm = new ChatOpenAI({
        modelName: "gpt-4o-mini",
        temperature: 0,
        openAIApiKey: import.meta.env.VITE_OPEN_AI_API_KEY,
      });

      const parser = StructuredOutputParser.fromZodSchema(
        z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            description: z.string(),
            timeEstimate: z.string(),
            resources: z.array(
              z.object({
                title: z.string(),
                url: z.string(),
              })
            ),
            videos: z.array(
              z.object({
                title: z.string(),
                url: z.string(),
                duration: z.string(),
                difficulty: z.enum([
                  "beginner",
                  "intermediate",
                  "advanced",
                  "children",
                ]),
              })
            ),
            dependencies: z.array(z.string()),
            completed: z.boolean().default(false),
            practicePrompt: z.string(),
          })
        )
      );

      const response = await llm.invoke([
        {
          role: "system",
          content: `You are an expert programming mentor. Create a detailed learning roadmap for the following requirements.
            Format the response as a JSON array of learning nodes with titles, descriptions, time estimates, and recommended resources.
            Important: Return only the raw JSON without any markdown formatting or code blocks. You must follow this scheme: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            description: z.string(),
            timeEstimate: z.string(),
            resources: z.array(
              z.object({
                title: z.string(),
                url: z.string(),
              })
            ),
            videos: z.array(
              z.object({
                title: z.string(),
                url: z.string(),
                duration: z.string(),
                difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'children']),
              })
            ),
            dependencies: z.array(z.string()),
            completed: z.boolean().default(false),
            practicePrompt: z.string(),
          })
        )`,
        },
        {
          role: "user",
          content: `Create a learning roadmap for ${formData.programmingLanguage}.
            Experience Level: ${formData.experienceLevel}
            Learning Goal: ${formData.learningGoal}
            Time Commitment: ${formData.timeCommitment}`,
        },
      ]);

      const cleanContent = (response.content as string)
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      const parsedRoadmap = await parser.parse(cleanContent);
      setRoadmap(parsedRoadmap);
    } catch (error) {
      console.error("Error generating roadmap:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Progress Dashboard */}
        {roadmap.length > 0 && (
          <div className="mb-8">
            <ProgressDashboard progress={progress} />
          </div>
        )}

        <Card className="p-8">
          <h1 className="text-4xl font-bold mb-8 text-center">
            Create Your Learning Roadmap
          </h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              generateRoadmap();
            }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="programmingLanguage">Programming Language</Label>
              <Input
                id="programmingLanguage"
                value={formData.programmingLanguage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    programmingLanguage: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experienceLevel">Experience Level</Label>
              <Select
                value={formData.experienceLevel}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    experienceLevel: value as FormData["experienceLevel"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="children">
                    Children (5-12 years)
                  </SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="learningGoal">Learning Goal</Label>
              <Textarea
                id="learningGoal"
                value={formData.learningGoal}
                onChange={(e: any) =>
                  setFormData({ ...formData, learningGoal: e.target.value })
                }
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeCommitment">Time Commitment</Label>
              <Input
                id="timeCommitment"
                value={formData.timeCommitment}
                onChange={(e) =>
                  setFormData({ ...formData, timeCommitment: e.target.value })
                }
                placeholder="e.g., 2 hours per day"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating...
                </div>
              ) : (
                "Generate Roadmap"
              )}
            </Button>
          </form>
        </Card>

        {/* Roadmap Visualization */}
        {roadmap.length > 0 && (
          <div className="mt-12 space-y-8">
            <h2 className="text-3xl font-bold text-center">
              Your Learning Roadmap
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {roadmap.map((node) => (
                <RoadmapNode key={node.id} node={node} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
