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
});

type FormValues = z.infer<typeof formSchema>;

interface DepartmentFormProps {
  department?: any;
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({
  department,
  onSubmit,
  onCancel,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: department
      ? {
          name: department.name,
          code: department.code,
        }
      : {
          name: "",
          code: "",
        },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>
          {department ? "Edit Department" : "Add New Department"}
        </DialogTitle>
        <DialogDescription>
          {department
            ? "Update the details for this department"
            : "Fill in the details to create a new department"}
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
                <FormLabel>Department Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Computer Science" {...field} />
                </FormControl>
                <FormDescription>
                  The full name of the department
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
                <FormLabel>Department Code</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. CS" {...field} />
                </FormControl>
                <FormDescription>
                  A short code for this department (e.g. CS, IT, ENG)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{department ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
};

export default DepartmentForm;
