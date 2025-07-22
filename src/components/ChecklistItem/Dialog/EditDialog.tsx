import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { ChecklistItemSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type EditDialogFormData = z.infer<typeof ChecklistItemSchema>;

const EditDialog = ({ listId, itemId, refetch }: { listId: number, itemId: number, refetch: () => void }) => {
  const [open, setOpen] = useState(false);
  const form = useForm<EditDialogFormData>({
    resolver: zodResolver(ChecklistItemSchema),
    defaultValues: {
      itemName: '',
    },
  });

  useEffect(() => {
    if (open) {
      fetchItemDetails();
    }
  }, [open]);

  const fetchItemDetails = async () => {
    try {
      // {base-url}/checklist/{listId}/item/{itemId}
      const response = await axiosInstance.get(`/checklist/${listId}/item/${itemId}`);
      if (response.status === 200) {
        form.reset({
          itemName: response.data.data.name,
        });
      }
    } catch (error) {
      console.error('Error fetching item details:', error);
    }
  };

  const onSubmit = async (data: EditDialogFormData) => {
    console.log('Form submitted:', data);
    try {
      const response = await axiosInstance.put(`/checklist/${listId}/item/${itemId}`, data);

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
        <Button variant="link" className="float-end cursor-pointer">
          <EditIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit item</DialogTitle>
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
              {form.formState.isSubmitting ? 'Updating...' : 'Update'}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditDialog;