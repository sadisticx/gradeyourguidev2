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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const StudentPortalPage = () => {
  const navigate = useNavigate();
  const [formCode, setFormCode] = useState("");
  const [error, setError] = useState("");
  const [pendingEvaluations, setPendingEvaluations] = useState([
    {
      id: "1",
      title: "CS101: Introduction to Computer Science",
      instructor: "Dr. Jane Smith",
      dueDate: "2023-12-15",
    },
    {
      id: "2",
      title: "MATH202: Calculus II",
      instructor: "Prof. Robert Johnson",
      dueDate: "2023-12-10",
    },
  ]);

  const handleFormCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formCode.trim()) {
      setError("Please enter a valid form code");
      return;
    }

    // In a real app, you would validate the form code against an API
    // For demo purposes, we'll just navigate to the evaluation page
    navigate(`/student/evaluation/${formCode}`);
  };

  const handlePendingEvaluation = (id: string) => {
    navigate(`/student/evaluation/${id}`, { state: { sectionId: "CS101-A" } });
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Student Evaluation Portal
      </h1>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Enter Evaluation Code</CardTitle>
            <CardDescription>
              Enter the evaluation code provided by your instructor to access a
              specific evaluation form.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormCodeSubmit}>
              <div className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="formCode">Evaluation Code</Label>
                  <Input
                    id="formCode"
                    placeholder="Enter code (e.g., ABC123)"
                    value={formCode}
                    onChange={(e) => {
                      setFormCode(e.target.value);
                      setError("");
                    }}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Access Evaluation
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Evaluations</CardTitle>
            <CardDescription>
              These are the evaluations that have been assigned to you and are
              pending completion.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingEvaluations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No pending evaluations at this time.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingEvaluations.map((evaluation) => (
                  <Card key={evaluation.id} className="bg-gray-50">
                    <CardContent className="p-4">
                      <h3 className="font-medium">{evaluation.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Instructor: {evaluation.instructor}
                      </p>
                      <div className="flex justify-between items-center mt-3">
                        <p className="text-xs text-red-500">
                          Due:{" "}
                          {new Date(evaluation.dueDate).toLocaleDateString()}
                        </p>
                        <Button
                          size="sm"
                          onClick={() => handlePendingEvaluation(evaluation.id)}
                        >
                          Complete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          About Faculty Evaluations
        </h2>
        <p className="mb-4">
          Your feedback is important! Faculty evaluations help improve the
          quality of education and teaching methods. All responses are anonymous
          and confidential.
        </p>
        <div className="grid gap-4 md:grid-cols-3 mt-6">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="font-medium mb-2">Why Evaluate?</h3>
            <p className="text-sm text-gray-600">
              Your feedback directly impacts teaching methods and course content
              for future students.
            </p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="font-medium mb-2">Anonymity</h3>
            <p className="text-sm text-gray-600">
              All evaluations are completely anonymous. Instructors cannot see
              who submitted which evaluation.
            </p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="font-medium mb-2">Deadline</h3>
            <p className="text-sm text-gray-600">
              Please complete all evaluations by their due dates to ensure your
              feedback is included.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPortalPage;
