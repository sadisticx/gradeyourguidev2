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
  section: z.string({
    required_error: "Please select a section",
  }),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  isActive: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface FormCreatorProps {
  onSubmit: (data: FormValues) => void;
  initialData?: any;
  questionnaires: any[];
  departments: any[];
  sections?: any[];
  instructors?: any[];
}

const FormCreator: React.FC<FormCreatorProps> = ({
  onSubmit,
  initialData,
  questionnaires = [],
  departments = [],
  sections = [],
  instructors = [],
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [filteredSections, setFilteredSections] = useState(sections);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          title: initialData.title || "",
          questionnaire: initialData.questionnaire || "",
          department: initialData.department_id || "",
          section: initialData.section || "",
          startDate: initialData.createdAt
            ? new Date(initialData.createdAt)
            : new Date(),
          endDate: initialData.expiresAt
            ? new Date(initialData.expiresAt)
            : new Date(new Date().setDate(new Date().getDate() + 14)),
          isActive: initialData.status === "active",
        }
      : {
          title: "",
          questionnaire: questionnaires[0]?.id || "",
          department: "",
          section: "",
          startDate: new Date(),
          endDate: new Date(new Date().setDate(new Date().getDate() + 14)),
          isActive: false,
        },
  });

  // Filter sections when department changes
  const watchDepartment = form.watch("department");

  useEffect(() => {
    if (watchDepartment) {
      const filtered = sections.filter(
        (section) => section.department_id === watchDepartment,
      );
      setFilteredSections(filtered);
    } else {
      setFilteredSections(sections);
    }
  }, [watchDepartment, sections]);

  const handleSubmit = (values: FormValues) => {
    setIsLoading(true);
    try {
      onSubmit(values);
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
            onSubmit={form.handleSubmit(handleSubmit)}
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
                        {questionnaires.map((questionnaire) => (
                          <SelectItem
                            key={questionnaire.id}
                            value={questionnaire.id}
                          >
                            {questionnaire.title}
                          </SelectItem>
                        ))}
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">All Departments</SelectItem>
                        {departments.map((department) => (
                          <SelectItem key={department.id} value={department.id}>
                            {department.name}
                          </SelectItem>
                        ))}
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Section</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a section" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredSections.length > 0 ? (
                          filteredSections.map((section) => (
                            <SelectItem key={section.id} value={section.id}>
                              {section.code}: {section.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>
                            No sections available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the class section for this evaluation
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      When students can start submitting evaluations
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                      When the evaluation form will close
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
