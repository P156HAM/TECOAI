import { Button } from "@/components/ui/button";

interface PracticeButtonProps {
  nodeId: string;
  practicePrompt: string;
}

export function PracticeButton({
  nodeId,
  practicePrompt,
}: PracticeButtonProps) {
  const handlePractice = () => {
    // navigate(`/practice?nodeId=${nodeId}&prompt=${practicePrompt}`);
    console.log(nodeId, practicePrompt);
  };

  return (
    <Button
      onClick={handlePractice}
      className="mt-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
    >
      Practice with AI
    </Button>
  );
}
