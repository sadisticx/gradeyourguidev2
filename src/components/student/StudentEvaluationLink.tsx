import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface StudentEvaluationLinkProps {
  className?: string;
}

const StudentEvaluationLink = ({
  className = "",
}: StudentEvaluationLinkProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/student/evaluation/demo-form");
  };

  return (
    <Button onClick={handleClick} className={className} variant="default">
      Access Student Evaluation Demo
    </Button>
  );
};

export default StudentEvaluationLink;
