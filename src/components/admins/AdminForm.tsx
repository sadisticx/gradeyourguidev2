import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    role: z.string({
      required_error: "Please select an admin role.",
    }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
    permissions: z.object({
      manageQuestionnaires: z.boolean().default(false),
      manageForms: z.boolean().default(false),
      viewAnalytics: z.boolean().default(false),
      manageAdmins: z.boolean().default(false),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

interface AdminFormProps {
  adminId?: string;
  onSubmit?: (data: FormValues) => void;
  onCancel?: () => void;
}

const AdminForm = ({
  adminId = "",
  onSubmit,
  onCancel = () => {},
}: AdminFormProps) => {
  const isEditing = !!adminId;

  // Fetch admin data when editing
  useEffect(() => {
    if (isEditing) {
      // In a real app, this would be an API call
      // For demo, we'll simulate with a timeout
      const timeout = setTimeout(() => {
        // Mock data for the selected admin
        const adminData = {
          name: "John Doe",
          email: "john.doe@example.com",
          role: "super_admin",
          permissions: {
            manageQuestionnaires: true,
            manageForms: true,
            viewAnalytics: true,
            manageAdmins: true,
          },
        };

        // Set form values
        form.reset(adminData);
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [isEditing, adminId]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: adminId
      ? {
          name: "", // Will be populated in useEffect
          email: "",
          role: "",
          password: "",
          confirmPassword: "",
          permissions: {
            manageQuestionnaires: false,
            manageForms: false,
            viewAnalytics: false,
            manageAdmins: false,
          },
        }
      : {
          name: "",
          email: "",
          role: "",
          password: "",
          confirmPassword: "",
          permissions: {
            manageQuestionnaires: false,
            manageForms: false,
            viewAnalytics: false,
            manageAdmins: false,
          },
        },
  });

  const handleSubmit = (values: FormValues) => {
    console.log("AdminForm - handleSubmit called with values:", values);
    if (onSubmit) {
      try {
        onSubmit(values);
      } catch (error) {
        console.error("Error in admin form submission:", error);
      }
    } else {
      console.warn("No onSubmit handler provided to AdminForm");
    }
  };

  return (
    <Card className="w-full max-w-2xl bg-white">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Administrator" : "Add New Administrator"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Update the administrator's details and permissions."
            : "Create a new administrator account with specific permissions."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="department_admin">
                        Department Admin
                      </SelectItem>
                      <SelectItem value="analyst">Analyst</SelectItem>
                      <SelectItem value="form_manager">Form Manager</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The role determines the default set of permissions.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isEditing && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Permissions</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="permissions.manageQuestionnaires"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Manage Questionnaires</FormLabel>
                        <FormDescription>
                          Create, edit, and delete evaluation questionnaires
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="permissions.manageForms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Manage Forms</FormLabel>
                        <FormDescription>
                          Distribute forms and control response collection
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="permissions.viewAnalytics"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>View Analytics</FormLabel>
                        <FormDescription>
                          Access and export evaluation results and reports
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="permissions.manageAdmins"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Manage Administrators</FormLabel>
                        <FormDescription>
                          Add, edit, and manage administrator accounts
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <CardFooter className="flex justify-end space-x-4 px-0">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? "Update Administrator" : "Create Administrator"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AdminForm;
