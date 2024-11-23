import { Card } from "@/components/ui/card";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  content: string;
  onChange: (value: string) => void;
  language: "typeScript" | "javaScript" | "python" | "java" | "go";
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  content,
  onChange,
  language,
}) => {
  return (
    <Card className="h-full p-4">
      <Editor
        height="90%"
        defaultLanguage={language}
        value={content}
        onChange={(value) => onChange(value || "")}
        theme="vs-dark"
        className=""
        options={{
          minimap: { enabled: false },
          fontSize: 16,
        }}
      />
    </Card>
  );
};
