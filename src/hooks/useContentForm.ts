import { useState } from "react";
import { Subject, GradeLevel } from "@/types/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChatOpenAI } from "@langchain/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";

interface FormData {
  subject: Subject;
  gradeLevel: GradeLevel;
}

interface UseContentFormReturn {
  formData: FormData;
  loading: boolean;
  handleInputChange: (field: keyof FormData, value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function useContentForm(): UseContentFormReturn {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    subject: "computerScience",
    gradeLevel: "highSchool",
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateContent = async () => {
    const llm = new ChatOpenAI({
      modelName: "gpt-4",
      temperature: 0.7,
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

    const prompt = `You are an expert teaching assistant. Create a detailed teaching roadmap with pedagogical resources and strategies for instructors.
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
      8. The content has to be generated in ${language}.
      9. Return only the raw JSON without any markdown formatting or code blocks. You must follow this scheme: z.array(
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
        )`;

    try {
      const response = await llm.invoke([{ role: "system", content: prompt }]);

      const cleanContent = (response.content as string)
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      const parsedContent = await parser.parse(cleanContent);
      return parsedContent;
    } catch (error) {
      console.error("Error generating content:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await generateContent();
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    handleInputChange,
    handleSubmit,
  };
}
