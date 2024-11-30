import type { z } from "zod";
import type { worksheetSchema } from "@/types/schemas";
import { Card } from "@/components/ui/card";

type WorksheetContentProps = {
  content: z.infer<typeof worksheetSchema>;
};

export function WorksheetContent({ content }: WorksheetContentProps) {
  return (
    <div className="space-y-4">
      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Instructions</h4>
        <p className="text-sm">{content.content.instructions}</p>
      </div>

      <div className="space-y-4">
        {content.content.questions.map((question, index) => (
          <Card key={index} className="p-4">
            <p className="font-medium mb-2">{question.question}</p>
            {question.options && (
              <ul className="space-y-2">
                {question.options.map((option, optIndex) => (
                  <li key={optIndex} className="text-sm">
                    {option}
                  </li>
                ))}
              </ul>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              {question.explanation}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
