import type { Checklist } from "@/lib/types"
import { Card, CardContent, CardHeader } from "../ui/card"
import { CheckCircle, Circle, Trash } from "lucide-react"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"

const ChecklistCard = ({ note }: { note: Checklist }) => {
  return (
    <Card className="break-inside-avoid">
      <CardHeader className="flex items-center justify-between">
        <div className="w-full flex flex-row gap-1">
          {note.checklistCompletionStatus ?
            <CheckCircle className="text-green-500" /> :
            <Circle className="text-gray-500" />
          }
          <h3>{note.name}</h3>
        </div>
        <Button variant="outline" size="icon">
          <Trash className="text-white" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {note.items?.map(item => (
          <div className="flex items-center" key={item.id} >
            <Checkbox checked={item.itemCompletionStatus} />
            <span className="ml-2">{item.name}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default ChecklistCard