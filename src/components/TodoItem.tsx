import { useState } from "react";
import { Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TodoItemProps {
  id: string;
  task: string;
  isComplete: boolean;
  deadline?: string;
  onUpdate: () => void;
}

export const TodoItem = ({ id, task, isComplete, deadline, onUpdate }: TodoItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    setIsUpdating(true);
    const { error } = await supabase
      .from("todos")
      .update({ is_complete: !isComplete })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update todo");
      console.error("Error updating todo:", error);
    } else {
      onUpdate();
    }
    setIsUpdating(false);
  };

  const handleDelete = async () => {
    setIsUpdating(true);
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete todo");
      console.error("Error deleting todo:", error);
    } else {
      toast.success("Todo deleted");
      onUpdate();
    }
    setIsUpdating(false);
  };

  return (
    <div
      className="group flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-secondary/50 transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Checkbox
        checked={isComplete}
        onCheckedChange={handleToggle}
        disabled={isUpdating}
        className="data-[state=checked]:bg-success data-[state=checked]:border-success"
      />
      <div className="flex-1 flex flex-col gap-1">
        <span
          className={`text-sm transition-all ${
            isComplete
              ? "line-through text-muted-foreground"
              : "text-foreground"
          }`}
        >
          {task}
        </span>
        {deadline && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(deadline), "PPP")}</span>
          </div>
        )}
      </div>
      <button
        onClick={handleDelete}
        disabled={isUpdating}
        className={`text-destructive hover:text-destructive/80 transition-all ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Delete todo"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};
