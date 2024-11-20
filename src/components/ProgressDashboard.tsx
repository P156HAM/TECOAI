import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProgress } from "@/types/roadmap";

interface ProgressDashboardProps {
  progress: UserProgress;
}

export function ProgressDashboard({ progress }: ProgressDashboardProps) {
  const completionPercentage =
    (progress.completedNodes.length / progress.totalNodes) * 100;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={completionPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {completionPercentage.toFixed(0)}% Complete
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Level</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{progress.currentLevel}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">XP Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{progress.xpPoints}</div>
        </CardContent>
      </Card>
    </div>
  );
}
