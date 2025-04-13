import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface Question {
  id: string;
  text: string;
  type: "rating" | "text";
  required: boolean;
}

interface Section {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

interface EvaluationFormProps {
  formId: string;
  title: string;
  description: string;
  instructor: string;
  course: string;
  sections: Section[];
  onSubmit?: (responses: Record<string, string>) => void;
}

const EvaluationForm = ({
  formId,
  title,
  description,
  instructor,
  course,
  sections,
  onSubmit,
}: EvaluationFormProps) => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState(0);

  // Calculate progress whenever responses change
  useEffect(() => {
    const totalRequiredQuestions = sections.reduce(
      (acc, section) =>
        acc + section.questions.filter((q) => q.required).length,
      0,
    );

    const answeredRequiredQuestions = sections.reduce((acc, section) => {
      return (
        acc +
        section.questions.filter((q) => q.required && responses[q.id]).length
      );
    }, 0);

    const calculatedProgress = Math.round(
      (answeredRequiredQuestions / totalRequiredQuestions) * 100,
    );
    setProgress(calculatedProgress);
  }, [responses, sections]);

  const handleRatingChange = (questionId: string, value: string) => {
    setResponses({ ...responses, [questionId]: value });
  };

  const handleTextChange = (questionId: string, value: string) => {
    setResponses({ ...responses, [questionId]: value });
  };

  const validateCurrentSection = () => {
    const currentSectionData = sections[currentSection];
    const requiredQuestions = currentSectionData.questions.filter(
      (q) => q.required,
    );
    const missingResponses = requiredQuestions.filter((q) => !responses[q.id]);

    if (missingResponses.length > 0) {
      setIsError(true);
      setTimeout(() => setIsError(false), 5000);
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validateCurrentSection()) {
      setCurrentSection(currentSection + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    setCurrentSection(currentSection - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateCurrentSection()) {
      // In a real app, this would send the data to an API
      console.log("Form responses:", {
        formId,
        responses,
        submittedAt: new Date().toISOString(),
      });

      if (onSubmit) {
        onSubmit(responses);
      }

      // Show success message
      setIsSubmitted(true);
      window.scrollTo(0, 0);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center py-6">
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
              <p className="text-gray-600 mb-6">
                Your evaluation has been submitted successfully. Your feedback
                is valuable and will help improve the quality of education.
              </p>
              <Button onClick={() => navigate("/")} className="mt-2">
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentSectionData = sections[currentSection];

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <form onSubmit={handleSubmit}>
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <CardTitle>{title}</CardTitle>
                <CardDescription className="mt-1">
                  {description}
                </CardDescription>
              </div>
              <div className="bg-gray-100 p-3 rounded-md text-sm">
                <div>
                  <strong>Instructor:</strong> {instructor}
                </div>
                <div>
                  <strong>Course:</strong> {course}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
        </Card>

        {isError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Please answer all required questions before proceeding.
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-4 flex items-center gap-2">
          <div className="bg-primary text-white text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center">
            {currentSection + 1}
          </div>
          <h2 className="text-xl font-semibold">{currentSectionData.title}</h2>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardDescription>{currentSectionData.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentSectionData.questions.map((question) => (
              <div key={question.id} className="space-y-3">
                <div className="flex items-start">
                  <h3 className="text-base font-medium">
                    {question.text}
                    {question.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </h3>
                </div>

                {question.type === "rating" ? (
                  <RadioGroup
                    value={responses[question.id] || ""}
                    onValueChange={(value) =>
                      handleRatingChange(question.id, value)
                    }
                    className="flex space-x-2"
                  >
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <div key={rating} className="flex flex-col items-center">
                        <RadioGroupItem
                          value={rating.toString()}
                          id={`${question.id}-${rating}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`${question.id}-${rating}`}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-white cursor-pointer"
                        >
                          {rating}
                        </Label>
                        <span className="text-xs mt-1">
                          {rating === 1
                            ? "Poor"
                            : rating === 2
                              ? "Fair"
                              : rating === 3
                                ? "Average"
                                : rating === 4
                                  ? "Good"
                                  : "Excellent"}
                        </span>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <Textarea
                    value={responses[question.id] || ""}
                    onChange={(e) =>
                      handleTextChange(question.id, e.target.value)
                    }
                    placeholder="Enter your response here"
                    className="min-h-[100px]"
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentSection === 0}
          >
            Previous
          </Button>

          {currentSection < sections.length - 1 ? (
            <Button type="button" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button type="submit">Submit Evaluation</Button>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            {sections.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${currentSection === index ? "bg-primary" : "bg-gray-300"}`}
              />
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default EvaluationForm;
