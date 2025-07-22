import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { ChecklistItemSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type AddDialogFormData = z.infer<typeof ChecklistItemSchema>;

const AddDialog = ({ checklistId, refetch }: { checklistId: number, refetch: () => void }) => {
  const [open, setOpen] = useState(false);

  const form = useForm<AddDialogFormData>({
    resolver: zodResolver(ChecklistItemSchema),
    defaultValues: {
      itemName: '',
    },
  });


  const onSubmit = async (data: AddDialogFormData) => {
    console.log('Form submitted:', data);
    try {
      const response = await axiosInstance.post(`/checklist/${checklistId}/item`, data);

      if (response.status !== 200) {
        toast.error('Item addition failed. Please try again.');
        throw new Error('Item addition failed');
      }

      toast("Item added successfully!");
      setOpen(false);
    } catch (error) {
      toast.error('Item addition failed. Please try again.');
      console.error('Item addition failed:', error);
    } finally {
      refetch();
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">add item</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add item</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name="itemName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Item Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              type="submit"
              className='w-full'
              disabled={form.formState.isSubmitting}
              onClick={form.handleSubmit(onSubmit)}
            >
              {form.formState.isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddDialog;