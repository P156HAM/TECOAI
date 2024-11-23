import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PracticeButtonProps {
  nodeId: string;
  practicePrompt: string;
}

export function PracticeButton({
  nodeId,
  practicePrompt,
}: PracticeButtonProps) {
  const navigate = useNavigate();
  const handlePractice = () => {
    navigate(`/practice?nodeId=${nodeId}&prompt=${practicePrompt}`);
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
