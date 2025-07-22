import type { Checklist } from "@/lib/types"
import { Card, CardContent, CardHeader } from "../ui/card"
import { CheckCircle, Circle, Trash } from "lucide-react"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import { useEffect, useState } from "react"
import axiosInstance from "@/api/axiosInstance"
import { toast } from "sonner"
import AddDialog from "../ChecklistItem/Dialog/AddDialog"
import EditDialog from "../ChecklistItem/Dialog/EditDialog"

const ChecklistCard = ({ note, refetch }: { note: Checklist, refetch: () => void }) => {
  const [content, setContent] = useState<Checklist>(note);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setContent(note);
  }, [note])

  const handleItemCheck = async (itemId: number) => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(`/checklist/${content.id}/item/${itemId}`);

      if (response.status !== 200) {
        toast.error('Update item check failed. Please try again.');
        throw new Error('Update item check failed');
      }

      const updatedItems = content.items.map(item => {
        if (item.id === itemId) {
          return { ...item, itemCompletionStatus: !item.itemCompletionStatus };
        }
        return item;
      });
      setContent({ ...content, items: updatedItems });
      toast("Update item check successful!");
    } catch (error) {
      toast.error('Update item check failed. Please try again.');
      console.error('Update item check failed:', error);
    } finally {
      setLoading(false);
      refetch();
    }
  };

  const handleAddItem = async (checklistId: number) => {
    const itemName = prompt("Enter item name:");
    if (!itemName) return;

    try {
      setLoading(true);
      const response = await axiosInstance.post(`/checklist/${checklistId}/item`, { name: itemName });

      if (response.status !== 200) {
        toast.error('Add item failed. Please try again.');
        throw new Error('Add item failed');
      }

      const newItem = response.data.data;
      setContent(prev => ({
        ...prev,
        items: [...prev.items, newItem]
      }));
      toast("Item added successfully!");
    } catch (error) {
      toast.error('Add item failed. Please try again.');
      console.error('Add item failed:', error);
    } finally {
      setLoading(false);
      refetch();
    }
  }

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.delete(`/checklist/${content.id}`);
      if (response.status !== 200) {
        toast.error('Delete checklist failed. Please try again.');
        throw new Error('Delete checklist failed');
      }
      toast("Checklist deleted successfully!");
    } catch (error) {
      console.error("Error deleting checklist:", error);
    } finally {
      setLoading(false);
      refetch();
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    try {
      setLoading(true);
      const response = await axiosInstance.delete(`/checklist/${content.id}/item/${itemId}`);
      if (response.status !== 200) {
        toast.error('Delete item failed. Please try again.');
        throw new Error('Delete item failed');
      }

      const updatedItems = content.items.filter(item => item.id !== itemId);
      setContent({ ...content, items: updatedItems });
      toast("Item deleted successfully!");
    } catch (error) {
      toast.error('Delete item failed. Please try again.');
      console.error('Delete item failed:', error);
    } finally {
      setLoading(false);
      refetch();
    }
  };

  return (
    <Card className="break-inside-avoid">
      <CardHeader className="flex items-center justify-between">
        <div className="w-full flex flex-row gap-1">
          <Checkbox
            id={`checklist-${content.id}`}
            checked={content.checklistCompletionStatus}
            disabled={true}
            className="size-8"
          />
          <Label htmlFor={`checklist-${content.id}`} className="ml-2 text-2xl">
            {content.name}
          </Label>
        </div>
        <Button variant="destructive" size="icon" className="cursor-pointer" disabled={loading} onClick={handleDelete}>
          <Trash className="text-white" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {content.items?.map(item => (
          <div className="flex items-center justify-between " key={item.id} >
            <div className="flex items-center">
              <Checkbox
                id={`checklist-item-${item.id}`}
                checked={item.itemCompletionStatus}
                onCheckedChange={() => handleItemCheck(item.id)}
              />
              <Label htmlFor={`checklist-item-${item.id}`} className="ml-2">
                {item.name}
              </Label>
            </div>
            <div className="flex items-center gap-1">
              <EditDialog listId={content.id} itemId={item.id} refetch={refetch} />
              <Button variant="link" size="icon" className="cursor-pointer" disabled={loading} onClick={() => handleDeleteItem(item.id)}>
                <Trash className="text-red-500" />
              </Button>
            </div>
          </div>
        ))}

        <AddDialog checklistId={content.id} refetch={refetch} />
      </CardContent>
    </Card >
  )
}

export default ChecklistCard