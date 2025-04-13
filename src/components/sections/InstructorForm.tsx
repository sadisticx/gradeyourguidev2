import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

// Form schema validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .optional()
    .or(z.literal("")),
  department_id: z.string({
    required_error: "Please select a department",
  }),
  sections: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface InstructorFormProps {
  instructor?: any;
  departments: any[];
  sections: any[];
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
}

const InstructorForm: React.FC<InstructorFormProps> = ({
  instructor,
  departments = [],
  sections = [],
  onSubmit,
  onCancel,
}) => {
  // Get section IDs from instructor if available
  const instructorSectionIds = instructor?.sections?.map((s) => s.id) || [];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: instructor
      ? {
          name: instructor.name,
          email: instructor.email || "",
          department_id: instructor.department_id,
          sections: instructorSectionIds,
        }
      : {
          name: "",
          email: "",
          department_id: departments[0]?.id || "",
          sections: [],
        },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  // Filter sections by department
  const departmentId = form.watch("department_id");
  const filteredSections = sections.filter(
    (section) => !departmentId || section.department_id === departmentId,
  );

  return (
    <div>
      <DialogHeader>
        <DialogTitle>
          {instructor ? "Edit Instructor" : "Add New Instructor"}
        </DialogTitle>
        <DialogDescription>
          {instructor
            ? "Update the details for this instructor"
            : "Fill in the details to create a new instructor"}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 py-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructor Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Dr. John Smith" {...field} />
                </FormControl>
                <FormDescription>
                  The full name of the instructor
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. john.smith@example.com" {...field} />
                </FormControl>
                <FormDescription>
                  The instructor's email address (optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  The department this instructor belongs to
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel>Assigned Sections</FormLabel>
            <div className="mt-2">
              {filteredSections.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No sections available for the selected department
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-md">
                  {filteredSections.map((section) => (
                    <FormField
                      key={section.id}
                      control={form.control}
                      name="sections"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={section.id}
                            className="flex flex-row items-start space-x-3 space-y-0 p-2 border rounded-md"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(section.id)}
                                onCheckedChange={(checked) => {
                                  const currentValues = field.value || [];
                                  if (checked) {
                                    field.onChange([
                                      ...currentValues,
                                      section.id,
                                    ]);
                                  } else {
                                    field.onChange(
                                      currentValues.filter(
                                        (value) => value !== section.id,
                                      ),
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm font-medium">
                                {section.code}
                              </FormLabel>
                              <FormDescription className="text-xs">
                                {section.name}
                              </FormDescription>
                            </div>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
              )}
              <FormDescription className="mt-2">
                Select the sections this instructor teaches
              </FormDescription>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{instructor ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
};

export default InstructorForm;
