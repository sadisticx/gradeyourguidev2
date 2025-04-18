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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Form schema validation
const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  questionnaire: z.string({
    required_error: "Please select a questionnaire",
  }),
  department: z.string().optional(),
  sections: z
    .array(z.string())
    .min(1, { message: "Please select at least one section" }),
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

  // Fetch sections, departments, and instructors if not provided
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
            const defaultDepartments = [
              {
                id: "1",
                name: "BSIT",
                code: "BSIT",
                fullName: "Bachelor of Science in Information Technology",
              },
              {
                id: "2",
                name: "BSHM",
                code: "BSHM",
                fullName: "Bachelor of Science in Hospitality Management",
              },
              {
                id: "3",
                name: "BSPOLSCI",
                code: "BSPOLSCI",
                fullName: "Bachelor of Science in Political Science",
              },
              {
                id: "4",
                name: "BSED",
                code: "BSED",
                fullName: "Bachelor of Science in Education",
              },
              {
                id: "5",
                name: "BSBA",
                code: "BSBA",
                fullName: "Bachelor of Science in Business Administration",
              },
            ];
            setAvailableDepartments(defaultDepartments);
          }
        } else {
          setAvailableDepartments(departments);
        }

        // Load sections if not provided
        if (sections.length === 0) {
          const sectData = await fetchData("sections");
          const instructorData = await fetchData("instructors");
          const sectionInstructorData = await fetchData("section_instructors");

          if (sectData && sectData.length > 0) {
            const formattedSections = sectData.map((section: any) => {
              // Find instructors for this section
              const sectionInstructors = sectionInstructorData
                .filter((si: any) => si.section_id === section.id)
                .map((si: any) => {
                  return instructorData.find(
                    (i: any) => i.id === si.instructor_id,
                  );
                })
                .filter(Boolean);

              return {
                id: section.id,
                name: `${section.code}: ${section.name}`,
                code: section.code,
                department_id: section.department_id,
                instructors: sectionInstructors,
              };
            });
            setAvailableSections(formattedSections);
            // Don't set filtered sections here to prevent flickering
          } else {
            // Default sections if none found - create sections for each department (1A-1D to 4A-4D)
            const defaultSections = [];
            const years = [1, 2, 3, 4];
            const sectionLetters = ["A", "B", "C", "D"];
            let sectionId = 1;

            // For each department
            for (let deptId = 1; deptId <= 4; deptId++) {
              // For each year
              years.forEach((year) => {
                // For each section letter
                sectionLetters.forEach((letter) => {
                  defaultSections.push({
                    id: `${sectionId}`,
                    name: `${year}${letter}`,
                    department_id: `${deptId}`,
                  });
                  sectionId++;
                });
              });
            }

            setAvailableSections(defaultSections);
            // Don't set filtered sections here to prevent flickering
          }
        } else {
          setAvailableSections(sections);
          // Don't set filtered sections here to prevent flickering
        }
      } catch (error) {
        console.error("Error loading data:", error);
        // Set default data if error
        const defaultDepartments = [
          {
            id: "1",
            name: "BSIT",
            code: "BSIT",
            fullName: "Bachelor of Science in Information Technology",
          },
          {
            id: "2",
            name: "BSHM",
            code: "BSHM",
            fullName: "Bachelor of Science in Hospitality Management",
          },
          {
            id: "3",
            name: "BSPOLSCI",
            code: "BSPOLSCI",
            fullName: "Bachelor of Science in Political Science",
          },
          {
            id: "4",
            name: "BSED",
            code: "BSED",
            fullName: "Bachelor of Science in Education",
          },
          {
            id: "5",
            name: "BSBA",
            code: "BSBA",
            fullName: "Bachelor of Science in Business Administration",
          },
        ];
        setAvailableDepartments(defaultDepartments);

        // Create default sections for each department (1A-1D to 4A-4D)
        const defaultSections = [];
        const years = [1, 2, 3, 4];
        const sectionLetters = ["A", "B", "C", "D"];
        let sectionId = 1;

        // For each department
        for (let deptId = 1; deptId <= 4; deptId++) {
          // For each year
          years.forEach((year) => {
            // For each section letter
            sectionLetters.forEach((letter) => {
              defaultSections.push({
                id: `${sectionId}`,
                name: `${year}${letter}`,
                department_id: `${deptId}`,
              });
              sectionId++;
            });
          });
        }

        setAvailableSections(defaultSections);
        // Don't set filtered sections here to prevent flickering
      }

      // Set initial filtered sections based on the current department value
      const currentDept = form.getValues("department");
      if (currentDept && currentDept !== "all-departments") {
        // Filter sections for the selected department
        const deptSections = availableSections.filter(
          (section) => section.department_id === currentDept,
        );
        setFilteredSections(deptSections.length > 0 ? deptSections : []);
      } else {
        // Show all sections when no department is selected
        setFilteredSections(availableSections);
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
          sections: initialData.section
            ? [initialData.section]
            : availableSections.length > 0
              ? [availableSections[0]?.id]
              : [],
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
          sections:
            availableSections.length > 0 ? [availableSections[0]?.id] : [],
          startDate: new Date(),
          startTime: "08:00",
          endDate: new Date(new Date().setDate(new Date().getDate() + 14)), // Default to 2 weeks from now
          endTime: "23:59",
          additionalInstructions: "",
          isActive: false,
          title: "",
        },
  });

  // Remove the useEffect hook that was causing flickering
  // We'll handle section filtering directly in the department selection handler

  const handleSubmit = (values: FormValues) => {
    console.log("Form submitted with values:", values);
    console.log("Form values structure:", JSON.stringify(values, null, 2));
    setIsLoading(true);

    try {
      // Automatically assign instructors based on selected sections
      const selectedSectionIds = values.sections;
      const instructorsForSections = new Set();

      // Find all instructors assigned to the selected sections
      selectedSectionIds.forEach((sectionId) => {
        const section = availableSections.find((s) => s.id === sectionId);
        if (section && section.instructors && section.instructors.length > 0) {
          section.instructors.forEach((instructor: any) => {
            instructorsForSections.add(instructor.id);
          });
        }
      });

      // Log the automatically assigned instructors
      console.log(
        "Automatically assigned instructors:",
        Array.from(instructorsForSections),
      );
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
      const sectionsParam = values.sections.join(",");
      const link = `${baseUrl}/student/evaluation/${uniqueId}?sections=${sectionsParam}`;
      setGeneratedLink(link);

      console.log("Processed form data:", updatedValues);
      console.log("Generated link:", link);

      // Call the onSubmit prop if provided
      if (onSubmit) {
        console.log(
          "Calling parent onSubmit function with data:",
          updatedValues,
        );
        onSubmit(updatedValues);
      } else {
        console.warn("No onSubmit handler provided to FormCreator");
        // Show a toast even if no onSubmit handler is provided
        toast({
          title: "Warning",
          description: "Form handler not configured. Data cannot be saved.",
          variant: "destructive",
        });
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
              e.preventDefault(); // Prevent default form submission
              console.log("Form submit event triggered");
              // Validate form before submission
              form.trigger().then((isValid) => {
                if (isValid) {
                  console.log("Form is valid, submitting...");
                  form.handleSubmit(handleSubmit)(e);
                } else {
                  console.log("Form validation failed");
                  toast({
                    title: "Validation Error",
                    description: "Please check the form for errors.",
                    variant: "destructive",
                  });
                }
              });
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
                        // This is the key to preventing flickering - we update the filtered sections
                        // synchronously when the department changes
                        if (value && value !== "all-departments") {
                          // Create a new filtered array instead of modifying state directly
                          const filtered = availableSections.filter(
                            (section) => section.department_id === value,
                          );
                          console.log("Filtered sections:", filtered);

                          // Update filtered sections state
                          setFilteredSections(
                            filtered.length > 0 ? filtered : [],
                          );

                          // Reset section selection if needed
                          const currentSection = form.getValues("section");
                          const sectionExists = filtered.some(
                            (section) => section.id === currentSection,
                          );

                          if (!sectionExists && filtered.length > 0) {
                            // Set the section value to the first filtered section
                            setTimeout(() => {
                              form.setValue("section", filtered[0].id);
                            }, 0);
                          }
                        } else {
                          // Show all sections when "All Departments" is selected
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
                                {department.fullName ||
                                  department.name ||
                                  "Unnamed Department"}
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
                name="sections"
                render={({ field }) => {
                  // Get current department for debugging
                  const currentDept = form.getValues("department");
                  console.log("Current department:", currentDept);
                  console.log("Available filtered sections:", filteredSections);
                  console.log("Selected sections:", field.value);

                  return (
                    <FormItem>
                      <FormLabel>Class Sections</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value.length && "text-muted-foreground",
                              )}
                            >
                              {field.value.length > 0
                                ? `${field.value.length} section${field.value.length > 1 ? "s" : ""} selected`
                                : "Select sections"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <div className="p-2 max-h-[300px] overflow-auto">
                            {filteredSections && filteredSections.length > 0 ? (
                              filteredSections.map((section, index) => {
                                const sectionId =
                                  section.id || `temp-section-${index}`;
                                const isSelected =
                                  field.value.includes(sectionId);

                                return (
                                  <div
                                    key={sectionId}
                                    className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md"
                                  >
                                    <Checkbox
                                      checked={isSelected}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...field.value, sectionId]
                                          : field.value.filter(
                                              (value) => value !== sectionId,
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                      id={`section-${sectionId}`}
                                    />
                                    <label
                                      htmlFor={`section-${sectionId}`}
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-grow"
                                    >
                                      {section.name || "Unnamed Section"}
                                    </label>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="p-4 text-sm text-muted-foreground">
                                No sections available for this department
                              </div>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Select one or more class sections for this evaluation.
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
