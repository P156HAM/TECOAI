import { z } from "zod";

// Base schema that all resource types share
const baseResourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  subject: z.string(),
  gradeLevel: z.string(),
  language: z.enum(["en", "sv"]),
  learningObjectives: z.array(z.string()),
  prerequisites: z.array(z.string()),
  teacherNotes: z.array(z.string()),
  differentiation: z.object({
    struggling: z.array(z.string()),
    advanced: z.array(z.string()),
  }),
  metadata: z.object({
    tags: z.array(z.string()),
    created: z.string(),
    lastModified: z.string(),
    version: z.string(),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  }),
});

export const videoSchema = baseResourceSchema.extend({
  type: z.literal("video"),
  content: z.object({
    videoResources: z.array(
      z.object({
        title: z.string(),
        url: z.string(),
        duration: z.string(),
        description: z.string(),
      })
    ),
  }),
});

export const worksheetSchema = baseResourceSchema.extend({
  type: z.literal("worksheet"),
  content: z.object({
    instructions: z.string(),
    questions: z.array(
      z.object({
        type: z.enum([
          "multiple_choice",
          "open_ended",
          "matching",
          "true_false",
        ]),
        question: z.string(),
        options: z.array(z.string()).optional(),
        correctAnswer: z.string().optional(),
        explanation: z.string(),
      })
    ),
    materials: z.array(z.string()),
  }),
});

// ... other schemas for projects, assessments, etc.
