import { BookOpen, Video, ExternalLink } from "lucide-react";
import { ProjectIdea, RoadmapNode as RoadmapNodeType } from "@/types/roadmap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useProjects } from "@/contexts/ProjectContext";

export function RoadmapNode({ node }: { node: RoadmapNodeType }) {
  const navigate = useNavigate();
  const { addProject } = useProjects();

  const handleExtractProject = async (project: ProjectIdea) => {
    try {
      const enhancedProject = {
        ...project,
        id: Date.now().toString(),
        sourceNode: node.title,
        subject: node.subject,
        status: "draft" as const,
      };
      addProject(enhancedProject);
      navigate("/projects");
    } catch (error) {
      console.error("Error generating project plan:", error);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{node.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{node.description}</p>

        {/* Learning Objectives */}
        <div className="space-y-2">
          <h4 className="font-semibold">Learning Objectives</h4>
          <ul className="list-disc list-inside text-sm">
            {node.learningObjectives.map((objective, index) => (
              <li key={index}>{objective}</li>
            ))}
          </ul>
        </div>

        {/* Teaching Strategies */}
        <div className="space-y-2">
          <h4 className="font-semibold">Teaching Strategies</h4>
          <ul className="list-disc list-inside text-sm">
            {node.teachingStrategies.map((strategy, index) => (
              <li key={index}>{strategy}</li>
            ))}
          </ul>
        </div>

        {/* Project Ideas */}
        {node.projectIdeas.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold">Project Ideas</h4>
            {node.projectIdeas.map((project, index) => (
              <div key={index} className="p-3 bg-muted rounded-lg">
                <h5 className="font-medium">{project.title}</h5>
                <p className="text-sm">{project.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-primary/10 rounded">
                      {project.difficulty}
                    </span>
                    <span className="px-2 py-1 bg-primary/10 rounded">
                      {project.estimatedDuration}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExtractProject(project)}
                  >
                    Extract Project
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Common Misconceptions */}
        <div className="space-y-2">
          <h4 className="font-semibold">Common Misconceptions</h4>
          <ul className="list-disc list-inside text-sm">
            {node.commonMisconceptions.map((misconception, index) => (
              <li key={index}>{misconception}</li>
            ))}
          </ul>
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

        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => {
              /* Create lesson plan */
            }}
          >
            Create Lesson Plan
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              /* Create assessment */
            }}
          >
            Create Assessment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
