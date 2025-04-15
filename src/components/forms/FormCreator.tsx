import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Copy } from "lucide-react";
import { fetchData } from "@/lib/supabase";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Form schema validation
const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  questionnaire: z.string({
    required_error: "Please select a questionnaire",
  }),
  department: z.string().optional(),
  section: z.string({
    required_error: "Please select a class section",
  }),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  startTime: z.string().optional(),
  endDate: z.date({
    required_error: "End date is required",
  }),
  endTime: z.string().optional(),
  additionalInstructions: z.string().optional(),
  isActive: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface FormCreatorProps {
  onSubmit?: (data: FormValues) => void;
  questionnaires?: { id: string; title: string }[];
  sections?: { id: string; name: string; department_id?: string }[];
  departments?: { id: string; name: string }[];
  initialData?: any;
}

const FormCreator = ({
  onSubmit,
  initialData,
  questionnaires = [],
  sections = [],
  departments = [],
}: FormCreatorProps) => {
  const [generatedLink, setGeneratedLink] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [availableSections, setAvailableSections] = useState(sections);
  const [filteredSections, setFilteredSections] = useState(sections);
  const [availableDepartments, setAvailableDepartments] = useState(departments);
  const { toast } = useToast();

  // Fetch sections and departments if not provided
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load departments if not provided
        if (departments.length === 0) {
          const deptData = await fetchData("departments");
          if (deptData && deptData.length > 0) {
            setAvailableDepartments(deptData);
          } else {
            // Default departments if none found
            setAvailableDepartments([
              { id: "1", name: "Computer Science", code: "CS" },
              { id: "2", name: "Information Technology", code: "IT" },
              { id: "3", name: "Engineering", code: "ENG" },
            ]);
          }
        } else {
          setAvailableDepartments(departments);
        }

        // Load sections if not provided
        if (sections.length === 0) {
          const sectData = await fetchData("sections");
          if (sectData && sectData.length > 0) {
            const formattedSections = sectData.map((section: any) => ({
              id: section.id,
              name: `${section.code}: ${section.name}`,
              department_id: section.department_id,
            }));
            setAvailableSections(formattedSections);
            setFilteredSections(formattedSections);
          } else {
            // Default sections if none found
            const defaultSections = [
              {
                id: "101",
                name: "CS101-A: Introduction to Programming",
                department_id: "1",
              },
              {
                id: "102",
                name: "CS201-B: Data Structures",
                department_id: "1",
              },
              {
                id: "103",
                name: "IT301-C: Web Development",
                department_id: "2",
              },
              {
                id: "104",
                name: "ENG401-D: Software Engineering",
                department_id: "3",
              },
            ];
            setAvailableSections(defaultSections);
            setFilteredSections(defaultSections);
          }
        } else {
          setAvailableSections(sections);
          setFilteredSections(sections);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        // Set default data if error
        setAvailableDepartments([
          { id: "1", name: "Computer Science", code: "CS" },
          { id: "2", name: "Information Technology", code: "IT" },
          { id: "3", name: "Engineering", code: "ENG" },
        ]);

        const defaultSections = [
          {
            id: "101",
            name: "CS101-A: Introduction to Programming",
            department_id: "1",
          },
          { id: "102", name: "CS201-B: Data Structures", department_id: "1" },
          { id: "103", name: "IT301-C: Web Development", department_id: "2" },
          {
            id: "104",
            name: "ENG401-D: Software Engineering",
            department_id: "3",
          },
        ];
        setAvailableSections(defaultSections);
        setFilteredSections(defaultSections);
      }
    };

    loadData();
  }, [sections, departments]);

  // Use default questionnaires if none provided
  const availableQuestionnaires =
    questionnaires.length > 0
      ? questionnaires
      : [
          { id: "1", title: "Teaching Effectiveness Evaluation" },
          { id: "2", title: "Course Content Evaluation" },
          { id: "3", title: "Faculty Engagement Assessment" },
        ];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          questionnaire:
            initialData.questionnaire ||
            availableQuestionnaires[0]?.id ||
            "default-questionnaire",
          department: initialData.department_id || "all-departments",
          section:
            initialData.section ||
            availableSections[0]?.id ||
            "default-section",
          startDate: initialData.createdAt
            ? new Date(initialData.createdAt)
            : new Date(),
          startTime: "08:00",
          endDate: initialData.expiresAt
            ? new Date(initialData.expiresAt)
            : new Date(new Date().setDate(new Date().getDate() + 14)),
          endTime: "23:59",
          additionalInstructions: initialData.additionalInstructions || "",
          isActive: initialData.status === "active",
          title: initialData.title || "",
        }
      : {
          questionnaire:
            availableQuestionnaires[0]?.id || "default-questionnaire",
          department: "all-departments",
          section: availableSections[0]?.id || "default-section",
          startDate: new Date(),
          startTime: "08:00",
          endDate: new Date(new Date().setDate(new Date().getDate() + 14)), // Default to 2 weeks from now
          endTime: "23:59",
          additionalInstructions: "",
          isActive: false,
          title: "",
        },
  });

  // Filter sections when department changes
  useEffect(() => {
    const selectedDepartment = form.getValues("department");

    if (selectedDepartment && selectedDepartment !== "all-departments") {
      // Only filter if we have a specific department selected
      const filtered = availableSections.filter(
        (section) => section.department_id === selectedDepartment,
      );

      // Update filtered sections
      setFilteredSections(filtered.length > 0 ? filtered : []);

      // If the current selected section is not in the filtered list, reset it
      const currentSection = form.getValues("section");
      const sectionExists = filtered.some(
        (section) => section.id === currentSection,
      );

      if (!sectionExists && filtered.length > 0) {
        form.setValue("section", filtered[0].id || `temp-section-0`);
      }
    } else {
      // Show all sections when "All Departments" is selected
      setFilteredSections(availableSections);
    }
  }, [form.watch("department"), availableSections]);

  const handleSubmit = (values: FormValues) => {
    console.log("Form submitted with values:", values);
    setIsLoading(true);

    try {
      // Combine date and time for start and end dates
      const startDateTime = new Date(values.startDate);
      const endDateTime = new Date(values.endDate);

      if (values.startTime) {
        const [hours, minutes] = values.startTime.split(":").map(Number);
        startDateTime.setHours(hours, minutes);
      }

      if (values.endTime) {
        const [hours, minutes] = values.endTime.split(":").map(Number);
        endDateTime.setHours(hours, minutes);
      }

      // Update the values with the combined date/time
      const updatedValues = {
        ...values,
        startDate: startDateTime,
        endDate: endDateTime,
      };

      // Generate a unique link for the form
      const uniqueId = Math.random().toString(36).substring(2, 10);
      const baseUrl = window.location.origin;
      const link = `${baseUrl}/student/evaluation/${uniqueId}?section=${values.section}`;
      setGeneratedLink(link);

      console.log("Processed form data:", updatedValues);
      console.log("Generated link:", link);

      // Call the onSubmit prop if provided
      if (onSubmit) {
        console.log("Calling parent onSubmit function");
        onSubmit(updatedValues);
      } else {
        console.warn("No onSubmit handler provided to FormCreator");
      }

      toast({
        title: "Success",
        description: initialData
          ? "Form updated successfully"
          : "Form created successfully",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "There was a problem saving the form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    toast({
      title: "Link Copied",
      description: "Evaluation form link copied to clipboard",
    });
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle>
          {initialData ? "Edit Evaluation Form" : "Create Evaluation Form"}
        </CardTitle>
        <CardDescription>
          Configure {initialData ? "this" : "a new"} evaluation form and
          distribute it to students.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              console.log("Form submit event triggered");
              form.handleSubmit(handleSubmit)(e);
            }}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Form Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a title for this evaluation form"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A descriptive title for this evaluation form
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="questionnaire"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Questionnaire Template</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a questionnaire template" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableQuestionnaires &&
                        availableQuestionnaires.length > 0 ? (
                          availableQuestionnaires.map(
                            (questionnaire, index) => (
                              <SelectItem
                                key={questionnaire.id || `quest-${index}`}
                                value={questionnaire.id || `temp-id-${index}`}
                              >
                                {questionnaire.title || "Unnamed Questionnaire"}
                              </SelectItem>
                            ),
                          )
                        ) : (
                          <SelectItem
                            key="no-questionnaires"
                            value="no-questionnaires"
                          >
                            No questionnaires available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the evaluation questionnaire to use for this form.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        console.log("Department changed to:", value);
                        field.onChange(value);

                        // Immediately filter sections based on selected department
                        if (value && value !== "all-departments") {
                          const filtered = availableSections.filter(
                            (section) => section.department_id === value,
                          );
                          console.log("Filtered sections:", filtered);
                          setFilteredSections(
                            filtered.length > 0 ? filtered : [],
                          );

                          // Reset section selection if needed
                          const currentSection = form.getValues("section");
                          const sectionExists = filtered.some(
                            (section) => section.id === currentSection,
                          );

                          if (!sectionExists && filtered.length > 0) {
                            form.setValue(
                              "section",
                              filtered[0].id || `temp-section-0`,
                            );
                          }
                        } else {
                          setFilteredSections(availableSections);
                        }
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="All Departments" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all-departments">
                          All Departments
                        </SelectItem>
                        {availableDepartments && availableDepartments.length > 0
                          ? availableDepartments.map((department, index) => (
                              <SelectItem
                                key={department.id || `dept-${index}`}
                                value={department.id || `temp-dept-${index}`}
                              >
                                {department.name || "Unnamed Department"}
                              </SelectItem>
                            ))
                          : null}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Filter sections by department (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="section"
                render={({ field }) => {
                  // Get current department for debugging
                  const currentDept = form.getValues("department");
                  console.log("Current department:", currentDept);
                  console.log("Available filtered sections:", filteredSections);

                  return (
                    <FormItem>
                      <FormLabel>Class Section</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          console.log("Section selected:", value);
                          field.onChange(value);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a class section" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredSections && filteredSections.length > 0 ? (
                            filteredSections.map((section, index) => (
                              <SelectItem
                                key={section.id || `section-${index}`}
                                value={section.id || `temp-section-${index}`}
                              >
                                {section.name || "Unnamed Section"}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem key="no-sections" value="no-sections">
                              No sections available for this department
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the class section for this evaluation.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                              type="button"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        When students can start submitting evaluations.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormDescription>
                        Time when the form becomes available
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                              type="button"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        When the evaluation form will close.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormDescription>
                        Time when the form closes
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="additionalInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Instructions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any additional instructions for students..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional instructions that will be displayed to students
                    before they complete the evaluation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Activate Form</FormLabel>
                    <FormDescription>
                      When activated, students will be able to access and submit
                      the evaluation form.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {generatedLink && (
              <div className="flex flex-col space-y-2 p-4 border rounded-lg bg-muted/50">
                <p className="text-sm font-medium">Evaluation Form Link</p>
                <div className="flex items-center space-x-2">
                  <Input value={generatedLink} readOnly className="flex-1" />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Share this link with students to collect their evaluations.
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                className="w-full md:w-auto"
                disabled={isLoading}
              >
                {isLoading
                  ? "Saving..."
                  : initialData
                    ? "Update Form"
                    : "Create Form"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FormCreator;
