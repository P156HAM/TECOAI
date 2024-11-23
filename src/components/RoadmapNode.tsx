import { BookOpen, Clock, Video, ExternalLink } from "lucide-react";
import { RoadmapNode as RoadmapNodeType } from "@/types/roadmap";
import { PracticeButton } from "./PracticeButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RoadmapNode({ node }: { node: RoadmapNodeType }) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{node.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{node.description}</p>

        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-2" />
          <span>{node.timeEstimate}</span>
        </div>

        {/* Resources Section */}
        {node.resources.length > 0 && (
          <div>
            <div className="flex items-center mb-2">
              <BookOpen className="h-4 w-4 mr-2" />
              <h4 className="font-semibold">Resources</h4>
            </div>
            <ul className="space-y-1">
              {node.resources.map((resource, index) => (
                <li key={index} className="flex items-center text-sm">
                  <ExternalLink className="h-3 w-3 mr-2 text-muted-foreground" />
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {resource.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Videos Section */}
        {node.videos.length > 0 && (
          <div>
            <div className="flex items-center mb-2">
              <Video className="h-4 w-4 mr-2" />
              <h4 className="font-semibold">Videos</h4>
            </div>
            <div className="space-y-2">
              {node.videos.map((video, index) => (
                <a
                  key={index}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-2 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">{video.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {video.duration}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        <PracticeButton nodeId={node.id} practicePrompt={node.practicePrompt} />
      </CardContent>
    </Card>
  );
}
