import { Card, CardContent } from "../ui/card";

const ChecklistInput = () => {
  return (
    <div className="max-w-xl mx-auto mb-8">
      <Card className="cursor-text shadow-md">
        <CardContent className="p-4">
          <p className="text-muted-foreground">Take a note...</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default ChecklistInput;