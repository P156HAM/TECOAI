import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
];

interface LanguageSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function LanguageSelect({ value, onValueChange }: LanguageSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem key={language.value} value={language.value}>
            {language.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
