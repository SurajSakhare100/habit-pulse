import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HabitInput({ newHabit, setNewHabit, addHabit }:any) {
  return (
    <Card className="p-4 border rounded-lg shadow-sm">
      <CardContent className="flex gap-2">
        <Input value={newHabit} onChange={(e) => setNewHabit(e.target.value)} placeholder="New Habit" />
        <Button onClick={addHabit}>Add</Button>
      </CardContent>
    </Card>
  );
}
