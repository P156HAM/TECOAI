import { useProjects } from "@/contexts/ProjectContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export function Projects() {
  const { projects } = useProjects();
  const [t] = useTranslation("global");

  useEffect(() => {
    console.log(t("projects.title"));
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-foreground">
        {t("projects.title")}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="dark:bg-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg text-foreground">
                  {project.title}
                </CardTitle>
                <Badge variant="outline">{project.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("projects.from")}: {project.sourceNode} ({project.subject})
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4 text-foreground">
                {project.description}
              </p>
              <div className="flex gap-2">
                <Badge variant="secondary">{project.difficulty}</Badge>
                <Badge variant="secondary">{project.estimatedDuration}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}

        {projects.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            {t("projects.noProjects")}
          </div>
        )}
      </div>
    </div>
  );
}
