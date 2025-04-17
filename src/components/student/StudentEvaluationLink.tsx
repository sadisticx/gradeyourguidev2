import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface StudentEvaluationLinkProps {
  className?: string;
  label?: string;
}

const StudentEvaluationLink = ({
  className = "",
  label = "Access Student Evaluation Demo",
}: StudentEvaluationLinkProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to the demo form route
    navigate("/demo-evaluation");
  };

  return (
    <Button onClick={handleClick} className={className} variant="default">
      {label}
    </Button>
  );
};

export default StudentEvaluationLink;
