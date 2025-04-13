import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle, Trash2, MoveUp, MoveDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";

const questionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, { message: "Question text is required" }),
  type: z.enum(["rating", "text"]),
  required: z.boolean().default(true),
});

const sectionSchema = z.object({
  id: z.string(),
  title: z.string().min(1, { message: "Section title is required" }),
  description: z.string().optional(),
  questions: z.array(questionSchema),
});

const questionnaireSchema = z.object({
  title: z.string().min(1, { message: "Questionnaire title is required" }),
  description: z.string().optional(),
  sections: z.array(sectionSchema),
});

type QuestionnaireFormValues = z.infer<typeof questionnaireSchema>;

interface QuestionnaireBuilderProps {
  initialData?: QuestionnaireFormValues;
  onSave?: (data: QuestionnaireFormValues) => void;
}

const QuestionnaireBuilder = ({
  initialData = {
    title: "",
    description: "",
    sections: [
      {
        id: "1",
        title: "Teaching Effectiveness",
        description:
          "Evaluate the instructor's teaching methods and effectiveness",
        questions: [
          {
            id: "1-1",
            text: "How would you rate the instructor's clarity in explaining course concepts?",
            type: "rating",
            required: true,
          },
          {
            id: "1-2",
            text: "What aspects of the teaching could be improved?",
            type: "text",
            required: true,
          },
        ],
      },
    ],
  },
  onSave = () => {},
}: QuestionnaireBuilderProps) => {
  const [activeTab, setActiveTab] = useState("general");
  const [activeSection, setActiveSection] = useState<string | null>(
    initialData.sections[0]?.id || null,
  );

  const form = useForm<QuestionnaireFormValues>({
    resolver: zodResolver(questionnaireSchema),
    defaultValues: initialData,
  });

  const { control, handleSubmit, watch, setValue, formState } = form;
  const { isDirty, isValid } = formState;
  const sections = watch("sections");

  const addSection = () => {
    const newId = Date.now().toString();
    const newSection = {
      id: newId,
      title: `New Section ${sections.length + 1}`,
      description: "",
      questions: [],
    };
    setValue("sections", [...sections, newSection], { shouldValidate: true });
    setActiveSection(newId);
    setActiveTab("sections");
  };

  const removeSection = (sectionId: string) => {
    const updatedSections = sections.filter(
      (section) => section.id !== sectionId,
    );
    setValue("sections", updatedSections, { shouldValidate: true });

    if (activeSection === sectionId) {
      setActiveSection(updatedSections[0]?.id || null);
    }
  };

  const addQuestion = (sectionId: string) => {
    const sectionIndex = sections.findIndex(
      (section) => section.id === sectionId,
    );
    if (sectionIndex === -1) return;

    const section = sections[sectionIndex];
    const newQuestion = {
      id: `${sectionId}-${section.questions.length + 1}`,
      text: "",
      type: "rating" as const,
      required: true,
    };

    const updatedQuestions = [...section.questions, newQuestion];
    const updatedSection = { ...section, questions: updatedQuestions };
    const updatedSections = [...sections];
    updatedSections[sectionIndex] = updatedSection;

    setValue("sections", updatedSections, { shouldValidate: true });
  };

  const removeQuestion = (sectionId: string, questionId: string) => {
    const sectionIndex = sections.findIndex(
      (section) => section.id === sectionId,
    );
    if (sectionIndex === -1) return;

    const section = sections[sectionIndex];
    const updatedQuestions = section.questions.filter(
      (q) => q.id !== questionId,
    );
    const updatedSection = { ...section, questions: updatedQuestions };
    const updatedSections = [...sections];
    updatedSections[sectionIndex] = updatedSection;

    setValue("sections", updatedSections, { shouldValidate: true });
  };

  const moveQuestion = (
    sectionId: string,
    questionId: string,
    direction: "up" | "down",
  ) => {
    const sectionIndex = sections.findIndex(
      (section) => section.id === sectionId,
    );
    if (sectionIndex === -1) return;

    const section = sections[sectionIndex];
    const questionIndex = section.questions.findIndex(
      (q) => q.id === questionId,
    );
    if (questionIndex === -1) return;

    if (direction === "up" && questionIndex === 0) return;
    if (direction === "down" && questionIndex === section.questions.length - 1)
      return;

    const newIndex = direction === "up" ? questionIndex - 1 : questionIndex + 1;
    const updatedQuestions = [...section.questions];
    [updatedQuestions[questionIndex], updatedQuestions[newIndex]] = [
      updatedQuestions[newIndex],
      updatedQuestions[questionIndex],
    ];

    const updatedSection = { ...section, questions: updatedQuestions };
    const updatedSections = [...sections];
    updatedSections[sectionIndex] = updatedSection;

    setValue("sections", updatedSections, { shouldValidate: true });
  };

  const moveSection = (sectionId: string, direction: "up" | "down") => {
    const sectionIndex = sections.findIndex(
      (section) => section.id === sectionId,
    );
    if (sectionIndex === -1) return;

    if (direction === "up" && sectionIndex === 0) return;
    if (direction === "down" && sectionIndex === sections.length - 1) return;

    const newIndex = direction === "up" ? sectionIndex - 1 : sectionIndex + 1;
    const updatedSections = [...sections];
    [updatedSections[sectionIndex], updatedSections[newIndex]] = [
      updatedSections[newIndex],
      updatedSections[sectionIndex],
    ];

    setValue("sections", updatedSections, { shouldValidate: true });
  };

  const onSubmit = (data: QuestionnaireFormValues) => {
    // Add any additional processing here if needed
    onSave(data);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm w-full">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Questionnaire Builder</h1>
            <Button type="submit" disabled={!isDirty || !isValid}>
              Save Questionnaire
            </Button>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-[400px]">
              <TabsTrigger value="general">General Information</TabsTrigger>
              <TabsTrigger value="sections">Sections & Questions</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Questionnaire Details</CardTitle>
                  <CardDescription>
                    Basic information about the evaluation questionnaire
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter questionnaire title"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The title of your faculty evaluation questionnaire
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter a description for this questionnaire"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide instructions or context for respondents
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sections" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  Questionnaire Sections
                </h2>
                <Button
                  type="button"
                  onClick={addSection}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Section
                </Button>
              </div>

              {sections.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">
                    No sections added yet. Click "Add Section" to get started.
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-4 space-y-4">
                    {sections.map((section) => (
                      <Card
                        key={section.id}
                        className={`cursor-pointer hover:border-primary transition-colors ${activeSection === section.id ? "border-primary" : ""}`}
                        onClick={() => setActiveSection(section.id)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base">
                              {section.title}
                            </CardTitle>
                            <div className="flex space-x-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveSection(section.id, "up");
                                }}
                              >
                                <MoveUp className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveSection(section.id, "down");
                                }}
                              >
                                <MoveDown className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeSection(section.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                          <CardDescription className="text-xs truncate">
                            {section.questions.length} question
                            {section.questions.length !== 1 ? "s" : ""}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>

                  <div className="col-span-8">
                    {activeSection ? (
                      <Card>
                        <CardHeader>
                          <CardTitle>Edit Section</CardTitle>
                          <CardDescription>
                            Configure section details and questions
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {sections.map((section, index) => {
                            if (section.id !== activeSection) return null;

                            return (
                              <div key={section.id} className="space-y-6">
                                <div className="space-y-4">
                                  <FormField
                                    control={control}
                                    name={`sections.${index}.title`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Section Title</FormLabel>
                                        <FormControl>
                                          <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={control}
                                    name={`sections.${index}.description`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>
                                          Section Description
                                        </FormLabel>
                                        <FormControl>
                                          <Textarea {...field} />
                                        </FormControl>
                                        <FormDescription>
                                          Optional context for this section
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>

                                <div className="space-y-4">
                                  <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-medium">
                                      Questions
                                    </h3>
                                    <Button
                                      type="button"
                                      onClick={() => addQuestion(section.id)}
                                      variant="outline"
                                      size="sm"
                                      className="flex items-center gap-1"
                                    >
                                      <PlusCircle className="h-4 w-4" />
                                      Add Question
                                    </Button>
                                  </div>

                                  {section.questions.length === 0 ? (
                                    <div className="text-center p-4 border border-dashed rounded-md">
                                      <p className="text-muted-foreground">
                                        No questions added yet
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="space-y-6">
                                      {section.questions.map(
                                        (question, qIndex) => (
                                          <Card key={question.id}>
                                            <CardHeader className="pb-2">
                                              <div className="flex justify-between items-start">
                                                <CardTitle className="text-sm">
                                                  Question {qIndex + 1}
                                                </CardTitle>
                                                <div className="flex space-x-1">
                                                  <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                      moveQuestion(
                                                        section.id,
                                                        question.id,
                                                        "up",
                                                      )
                                                    }
                                                  >
                                                    <MoveUp className="h-4 w-4" />
                                                  </Button>
                                                  <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                      moveQuestion(
                                                        section.id,
                                                        question.id,
                                                        "down",
                                                      )
                                                    }
                                                  >
                                                    <MoveDown className="h-4 w-4" />
                                                  </Button>
                                                  <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                      removeQuestion(
                                                        section.id,
                                                        question.id,
                                                      )
                                                    }
                                                  >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                  </Button>
                                                </div>
                                              </div>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                              <FormField
                                                control={control}
                                                name={`sections.${index}.questions.${qIndex}.text`}
                                                render={({ field }) => (
                                                  <FormItem>
                                                    <FormLabel>
                                                      Question Text
                                                    </FormLabel>
                                                    <FormControl>
                                                      <Textarea {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                  </FormItem>
                                                )}
                                              />
                                              <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                  control={control}
                                                  name={`sections.${index}.questions.${qIndex}.type`}
                                                  render={({ field }) => (
                                                    <FormItem>
                                                      <FormLabel>
                                                        Question Type
                                                      </FormLabel>
                                                      <Select
                                                        onValueChange={
                                                          field.onChange
                                                        }
                                                        defaultValue={
                                                          field.value
                                                        }
                                                      >
                                                        <FormControl>
                                                          <SelectTrigger>
                                                            <SelectValue placeholder="Select type" />
                                                          </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                          <SelectItem value="rating">
                                                            5-Point Rating Scale
                                                          </SelectItem>
                                                          <SelectItem value="text">
                                                            Text Response
                                                          </SelectItem>
                                                        </SelectContent>
                                                      </Select>
                                                      <FormMessage />
                                                    </FormItem>
                                                  )}
                                                />
                                                <FormField
                                                  control={control}
                                                  name={`sections.${index}.questions.${qIndex}.required`}
                                                  render={({ field }) => (
                                                    <FormItem className="flex flex-row items-end space-x-3 space-y-0">
                                                      <FormControl>
                                                        <div className="flex items-center space-x-2">
                                                          <input
                                                            type="checkbox"
                                                            checked={
                                                              field.value
                                                            }
                                                            onChange={
                                                              field.onChange
                                                            }
                                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                          />
                                                          <FormLabel className="text-sm font-normal">
                                                            Required question
                                                          </FormLabel>
                                                        </div>
                                                      </FormControl>
                                                    </FormItem>
                                                  )}
                                                />
                                              </div>
                                            </CardContent>
                                          </Card>
                                        ),
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="h-full flex items-center justify-center p-8">
                        <p className="text-muted-foreground">
                          Select a section to edit or create a new one
                        </p>
                      </Card>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
};

export default QuestionnaireBuilder;
