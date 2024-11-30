import { Video, ExternalLink } from "lucide-react";
import type { z } from "zod";
import type { videoSchema } from "@/types/schemas";

type VideoContentProps = {
  content: z.infer<typeof videoSchema>;
};

export function VideoContent({ content }: VideoContentProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center mb-2">
        <Video className="h-4 w-4 mr-2" />
        <h4 className="font-semibold">Video Resources</h4>
      </div>
      <div className="space-y-2">
        {content.content.videoResources.map((video, index) => (
          <a
            key={index}
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-2 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
          >
            <div>
              <p className="text-sm font-medium">{video.title}</p>
              <p className="text-xs text-muted-foreground">{video.duration}</p>
              <p className="text-xs text-muted-foreground">
                {video.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
