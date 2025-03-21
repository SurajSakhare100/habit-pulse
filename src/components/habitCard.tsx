import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HabitCard({ habit, logHabit }:any) {
  return (
    <Card key={habit._id} className="flex justify-between items-center p-4 border rounded-lg shadow-sm">
      <CardContent>{habit.habitName}</CardContent>
      <Button variant="outline" onClick={() => logHabit(habit._id)}>
        ✔
      </Button>
    </Card>
  );
}