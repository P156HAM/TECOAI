import { Subject, GradeLevel, ResourceType } from "@/types/types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loadingSpinner";

export interface ContentGenerationFormProps {
  formData: {
    subject: Subject;
    gradeLevel: GradeLevel;
  };
  loading: boolean;
  onInputChange: (
    field: keyof ContentGenerationFormProps["formData"],
    value: string
  ) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export function ContentGenerationForm({
  formData,
  loading,
  onInputChange,
  onSubmit,
}: ContentGenerationFormProps) {
  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Create Educational Content
      </h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select
              value={formData.subject}
              onValueChange={(value) => onInputChange("subject", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="computerScience">
                  Computer Science
                </SelectItem>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="physics">Physics</SelectItem>
                <SelectItem value="chemistry">Chemistry</SelectItem>
                <SelectItem value="biology">Biology</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gradeLevel">Grade Level</Label>
            <Select
              value={formData.gradeLevel}
              onValueChange={(value) => onInputChange("gradeLevel", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select grade level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="elementary">Elementary School</SelectItem>
                <SelectItem value="middleSchool">Middle School</SelectItem>
                <SelectItem value="highSchool">High School</SelectItem>
                <SelectItem value="college">College</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button type="submit" className="w-full mt-6" disabled={loading}>
          {loading ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner />
              <span className="ml-2">Generating...</span>
            </div>
          ) : (
            "Generate Content"
          )}
        </Button>
      </form>
    </Card>
  );
}
