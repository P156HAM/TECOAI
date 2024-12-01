import { useState } from "react";
import { RoadmapNode as RoadmapNodeType } from "@/types/roadmap";
import { ContentNode } from "@/components/ContentNode";
import { ContentGenerationForm } from "@/components/ContentGenerationForm";
import { useContentForm } from "@/hooks/useContentForm";
import { ContentGenerationFormProps } from "@/components/ContentGenerationForm";
export default function Profile() {
  const [roadmap, setRoadmap] = useState<RoadmapNodeType[]>(() => {
    const saved = localStorage.getItem("roadmap");
    return saved ? JSON.parse(saved) : [];
  });

  const { formData, loading, handleInputChange, handleSubmit } =
    useContentForm();

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <ContentGenerationForm
          formData={formData}
          loading={loading}
          onInputChange={(
            field: keyof ContentGenerationFormProps["formData"],
            value: string
          ) => handleInputChange(field, value)}
          onSubmit={handleSubmit}
        />

        {roadmap.length > 0 && (
          <div className="mt-8">
            <div className="grid gap-4 md:grid-cols-2">
              {roadmap.map((node) => (
                <ContentNode key={node.id} node={node} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
