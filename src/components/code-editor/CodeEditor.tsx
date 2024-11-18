import { Card } from "@/components/ui/card";
import Editor from "@monaco-editor/react";
import { LanguageSelect } from "./LanguageSelect";
import { useState } from "react";

export function CodeEditor() {
  const [language, setLanguage] = useState("javascript");

  return (
    <Card className="h-full p-4">
      <div className="mb-4">
        <LanguageSelect value={language} onValueChange={setLanguage} />
      </div>
      <Editor
        height="90%"
        defaultLanguage={language}
        defaultValue="// Start coding here..."
        theme="vs-dark"
        className=""
        options={{
          minimap: { enabled: false },
          fontSize: 16,
        }}
      />
    </Card>
  );
}
