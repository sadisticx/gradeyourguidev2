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

// Form schema validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  code: z.string().min(2, { message: "Code must be at least 2 characters" }),
  department_id: z.string({
    required_error: "Please select a department",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface SectionFormProps {
  section?: any;
  departments: any[];
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
}

const SectionForm: React.FC<SectionFormProps> = ({
  section,
  departments = [],
  onSubmit,
  onCancel,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: section
      ? {
          name: section.name,
          code: section.code,
          department_id: section.department_id,
        }
      : {
          name: "",
          code: "",
          department_id: departments[0]?.id || "",
        },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>
          {section ? "Edit Section" : "Add New Section"}
        </DialogTitle>
        <DialogDescription>
          {section
            ? "Update the details for this section"
            : "Fill in the details to create a new section"}
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
                <FormLabel>Section Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Introduction to Programming"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The full name of the section or course
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section Code</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. CS101-A" {...field} />
                </FormControl>
                <FormDescription>
                  A unique code for this section (e.g. CS101-A)
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
                  The department this section belongs to
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{section ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
};

export default SectionForm;
