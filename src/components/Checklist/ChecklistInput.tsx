import { ChecklistSchema } from "@/lib/schema";
import { Card, CardContent } from "../ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "sonner";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";


type AddDialogFormData = z.infer<typeof ChecklistSchema>;
const ChecklistInput = ({ refetch }: { refetch: () => void }) => {
  const form = useForm<AddDialogFormData>({
    resolver: zodResolver(ChecklistSchema),
    defaultValues: {
      name: '',
    },
  });


  const onSubmit = async (data: AddDialogFormData) => {
    console.log('Form submitted:', data);
    try {
      const response = await axiosInstance.post(`/checklist`, data);

      if (response.status !== 200) {
        toast.error('Add checklist failed. Please try again.');
        throw new Error('Add checklist failed');
      }

      toast("Checklist added successfully!");
    } catch (error) {
      toast.error('Add checklist failed. Please try again.');
      console.error('Add checklist failed:', error);
    } finally {
      refetch();
      form.reset();
    }
  };

  return (
    <div className="max-w-xl mx-auto mb-8">
      <Card className="cursor-text shadow-md">
        <CardContent className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <textarea
                        placeholder="Tulis disini..."
                        {...field}
                        className="border-0 outline-0 focus:border-0 focus:ring-0 focus:outline-none bg-transparent p-0 text-base font-normal shadow-none resize-none w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="float-end mt-4" disabled={!form.formState.isValid}>
                Save
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ChecklistInput;