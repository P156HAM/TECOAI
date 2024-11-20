import { RoadmapNode as RoadmapNodeType } from "@/types/roadmap";
import { PracticeButton } from "./PracticeButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RoadmapNode({ node }: { node: RoadmapNodeType }) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle>{node.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{node.description}</p>

        <div className="mt-4">
          <p className="text-sm text-gray-500">
            ⏱️ Estimated time: {node.timeEstimate}
          </p>
        </div>

        {/* Resources Section */}
        {node.resources.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold text-gray-700 mb-3">📚 Resources</h4>
            <ul className="space-y-2">
              {node.resources.map((resource, index) => (
                <li key={index}>
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
          <div className="mt-6">
            <h4 className="font-semibold text-gray-700 mb-3">
              🎥 Recommended Videos
            </h4>
            <div className="grid gap-4">
              {node.videos.map((video, index) => (
                <a
                  key={index}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="ml-3">
                    <p className="font-medium">{video.title}</p>
                    <p className="text-sm text-gray-500">{video.duration}</p>
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
