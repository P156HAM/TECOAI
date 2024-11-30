import { RoadmapNode } from "@/types/roadmap";

interface BaseContentProps {
  content: RoadmapNode;
}

export function BaseContent({ content }: BaseContentProps) {
  return (
    <div>
      <p>{content.description}</p>
    </div>
  );
}
