import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProgress } from "@/types/roadmap";
import { Target, Trophy, Zap } from "lucide-react";

interface ProgressDashboardProps {
  progress: UserProgress;
}

export function ProgressDashboard({ progress }: ProgressDashboardProps) {
  const completionPercentage = progress.totalNodes
    ? (progress.completedNodes.length / progress.totalNodes) * 100
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Overall Progress
          </CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative h-24 w-24">
              <svg className="h-24 w-24 transform -rotate-90">
                <circle
                  className="text-muted stroke-current"
                  strokeWidth="4"
                  fill="transparent"
                  r="44"
                  cx="48"
                  cy="48"
                />
                <circle
                  className="text-primary stroke-current"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="transparent"
                  r="44"
                  cx="48"
                  cy="48"
                  strokeDasharray={`${2 * Math.PI * 44}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 44 * (1 - completionPercentage / 100)
                  }`}
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <p className="text-xl font-bold">
                  {completionPercentage.toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Level</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold">
              {progress.currentLevel || 1}
            </div>
            <p className="text-xs text-muted-foreground">Level</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">XP Points</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold">{progress.xpPoints || 0}</div>
            <p className="text-xs text-muted-foreground">XP</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
