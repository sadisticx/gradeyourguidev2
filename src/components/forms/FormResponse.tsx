import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

interface FormResponseProps {
  formId?: string;
  sectionId?: string;
}

const FormResponse = ({ formId, sectionId }: FormResponseProps) => {
  const params = useParams();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);

  // Use params if props are not provided
  const actualFormId = formId || params.formId;
  const actualSectionId = sectionId || params.sectionId;

  // Mock form data - in a real app, this would be fetched from an API
  const formData = {
    id: actualFormId || "1",
    title: "End of Semester Evaluation",
    description:
      "Please provide your honest feedback about the course and instructor.",
    sections: [
      {
        id: "s1",
        title: "Teaching Effectiveness",
        description:
          "Evaluate the instructor's teaching methods and effectiveness",
        questions: [
          {
            id: "q1",
            text: "How would you rate the instructor's clarity in explaining course concepts?",
            type: "rating",
            required: true,
          },
          {
            id: "q2",
            text: "How well did the instructor respond to student questions?",
            type: "rating",
            required: true,
          },
          {
            id: "q3",
            text: "What aspects of the teaching could be improved?",
            type: "text",
            required: false,
          },
        ],
      },
      {
        id: "s2",
        title: "Course Content",
        description: "Evaluate the course materials and content",
        questions: [
          {
            id: "q4",
            text: "How relevant were the course materials to your learning goals?",
            type: "rating",
            required: true,
          },
          {
            id: "q5",
            text: "How would you rate the difficulty level of the course?",
            type: "rating",
            required: true,
          },
          {
            id: "q6",
            text: "What topics would you like to see added or removed from the course?",
            type: "text",
            required: false,
          },
        ],
      },
    ],
  };

  const [responses, setResponses] = useState<Record<string, string>>({});

  const handleRatingChange = (questionId: string, value: string) => {
    setResponses({ ...responses, [questionId]: value });
  };

  const handleTextChange = (questionId: string, value: string) => {
    setResponses({ ...responses, [questionId]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const requiredQuestions = formData.sections.flatMap((section) =>
      section.questions.filter((q) => q.required),
    );

    const missingResponses = requiredQuestions.filter((q) => !responses[q.id]);

    if (missingResponses.length > 0) {
      setIsError(true);
      setTimeout(() => setIsError(false), 5000);
      return;
    }

    // In a real app, this would send the data to an API
    console.log("Form responses:", {
      formId: actualFormId,
      sectionId: actualSectionId,
      responses,
      submittedAt: new Date().toISOString(),
    });

    // Show success message
    setIsSubmitted(true);
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

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <form onSubmit={handleSubmit}>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{formData.title}</CardTitle>
            <CardDescription>{formData.description}</CardDescription>
          </CardHeader>
        </Card>

        {isError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Please answer all required questions before submitting.
            </AlertDescription>
          </Alert>
        )}

        {formData.sections.map((section) => (
          <Card key={section.id} className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">{section.title}</CardTitle>
              {section.description && (
                <CardDescription>{section.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {section.questions.map((question) => (
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
                        <div
                          key={rating}
                          className="flex flex-col items-center"
                        >
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
        ))}

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate("/")}>
            Cancel
          </Button>
          <Button type="submit">Submit Evaluation</Button>
        </div>
      </form>
    </div>
  );
};

export default FormResponse;
