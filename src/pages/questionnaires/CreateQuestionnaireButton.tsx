import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface CreateQuestionnaireButtonProps {
  onClick: () => void;
  className?: string;
}

const CreateQuestionnaireButton: React.FC<CreateQuestionnaireButtonProps> = ({
  onClick,
  className = "",
}) => {
  return (
    <Button onClick={onClick} className={className} size="lg" variant="default">
      <PlusCircle className="mr-2 h-5 w-5" />
      Create New Questionnaire
    </Button>
  );
};

export default CreateQuestionnaireButton;
