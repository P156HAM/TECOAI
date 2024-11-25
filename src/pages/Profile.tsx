import { useState } from "react";
import { ChatOpenAI } from "@langchain/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { ResourceType, RoadmapNode as RoadmapNodeType } from "@/types/roadmap";
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
import { GradeLevel, Subject } from "@/types/types";

export default function Profile() {
  const [formData, setFormData] = useState({
    subject: "computerScience" as Subject,
    gradeLevel: "highSchool" as GradeLevel,
    resourceType: "video" as ResourceType,
  });
  const [roadmap, setRoadmap] = useState<RoadmapNodeType[]>(() => {
    const saved = localStorage.getItem("roadmap");
    return saved ? JSON.parse(saved) : [];
  });
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
        modelName: "gpt-4o",
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
            learningObjectives: z.array(z.string()),
            teachingStrategies: z.array(z.string()),
            projectIdeas: z.array(
              z.object({
                title: z.string(),
                description: z.string(),
                difficulty: z.enum(["easy", "medium", "hard"]),
                groupSize: z.number(),
                materials: z.array(z.string()),
                estimatedDuration: z.string(),
                learningObjectives: z.array(z.string()),
              })
            ),
            resources: z.array(
              z.object({
                title: z.string(),
                url: z.string(),
                type: z.enum([
                  "video",
                  "article",
                  "exercise",
                  "documentation",
                  "tutorial",
                ]),
                duration: z.string().optional(),
                difficulty: z.enum(["easy", "medium", "hard"]).optional(),
              })
            ),
            studentMotivationTips: z.array(z.string()),
            commonMisconceptions: z.array(z.string()),
            differentiationStrategies: z.array(z.string()),
            assessmentIdeas: z.array(
              z.object({
                type: z.enum(["quiz", "project", "presentation", "homework"]),
                description: z.string(),
                rubric: z.array(z.string()).optional(),
              })
            ),
            dependencies: z.array(z.string()),
            completed: z.boolean().default(false),
            videos: z.array(
              z.object({
                title: z.string(),
                url: z.string(),
                duration: z.string(),
              })
            ),
          })
        )
      );

      const response = await llm.invoke([
        {
          role: "system",
          content: `You are an expert teaching assistant. Create a detailed teaching roadmap with pedagogical resources and strategies for instructors.
            Format the response as a JSON array of teaching nodes with lesson plans, teaching strategies, student engagement tips, and educational resources.
                  Important guidelines:
      1. For video resources, only use real URLs from YouTube or other educational platforms. Prefer links from:
         - YouTube channels like Computerphile, CS50, or Khan Academy
         - Platform-specific courses from Coursera, edX, or Udacity
      2. Ensure all fields in the schema are populated with meaningful content
      3. Keep responses focused and concise
      4. Make sure difficulty levels are appropriate for the specified grade level
      5. Include practical, hands-on project ideas
      6. Ensure all URLs are real and functional
      8. You must generate at least 4 nodes.
      7. Each node MUST include:
         - At least 3 videos with real YouTube/educational platform URLs
         - At least 2 project ideas
         - At least 4 educational resources
      8. Return only the raw JSON without any markdown formatting or code blocks. You must follow this scheme: z.array(
          z.object({
            id: z.string(),
            title: z.string(), 
            description: z.string(),
            timeEstimate: z.string(),
            learningObjectives: z.array(z.string()),
            teachingStrategies: z.array(z.string()),
            projectIdeas: z.array(
              z.object({
                title: z.string(),
                description: z.string(),
                difficulty: z.enum(['easy', 'medium', 'hard']),
                groupSize: z.number(),
                materials: z.array(z.string()),
                estimatedDuration: z.string(),
                learningObjectives: z.array(z.string()),
              })
            ).min(2),
            resources: z.array(
              z.object({
                title: z.string(),
                url: z.string(),
                type: z.enum(['video', 'article', 'exercise', 'documentation', 'tutorial']),
                duration: z.string(),
                difficulty: z.enum(['easy', 'medium', 'hard']),
              })
            ).min(4),
            studentMotivationTips: z.array(z.string()),
            commonMisconceptions: z.array(z.string()),
            differentiationStrategies: z.array(z.string()),
            assessmentIdeas: z.array(
              z.object({
                type: z.enum(['quiz', 'project', 'presentation', 'homework']),
                description: z.string(),
                rubric: z.array(z.string()),
              })
            ),
            dependencies: z.array(z.string()),
            completed: z.boolean().default(false),
            videos: z.array(
              z.object({
                title: z.string(),
                url: z.string(),
                duration: z.string(),
              })
            ).min(3),
          })
        )`,
        },
        {
          role: "user",
          content: `Create a teaching roadmap for ${formData.subject}.
            Student Experience Level: ${formData.gradeLevel}
            Teaching Goal: ${formData.resourceType}
            Course Duration: ${formData.subject}`,
        },
      ]);

      const cleanContent = (response.content as string)
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .replace(/,(\s*[}\]])/g, "$1")
        .trim();

      const parsedRoadmap = await parser.parse(cleanContent);
      const roadmapWithSubject = parsedRoadmap.map((node) => ({
        ...node,
        subject: formData.subject,
      }));
      setRoadmap(roadmapWithSubject);
      localStorage.setItem("roadmap", JSON.stringify(roadmapWithSubject));
    } catch (error) {
      console.error("Error generating teaching roadmap:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        {roadmap.length > 0 && (
          <div className="mb-6">
            <ProgressDashboard progress={progress} />
          </div>
        )}

        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Create Your Student's Learning Roadmap
          </h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              generateRoadmap();
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      subject: value as Subject,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="computerScience">
                      Computer Science
                    </SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="biology">Biology</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experienceLevel">Grade Level</Label>
                <Select
                  value={formData.gradeLevel}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      gradeLevel: value as GradeLevel,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="elementary">
                      Elementary School
                    </SelectItem>
                    <SelectItem value="middleSchool">Middle School</SelectItem>
                    <SelectItem value="highSchool">High School</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="resourceType">Resource Type</Label>
                <Select
                  value={formData.resourceType}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      resourceType: value as ResourceType,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select resource type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="interactive">Interactive</SelectItem>
                    <SelectItem value="worksheet">Worksheet</SelectItem>
                    <SelectItem value="assessment">Assessment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="learningGoal">Learning Goal</Label>
                <Input
                  id="learningGoal"
                  placeholder="What do you want to achieve?"
                  className="h-[40px]"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full mt-6" disabled={loading}>
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
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Your Learning Roadmap</h2>
            <div className="grid gap-4 md:grid-cols-2">
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
