import { useState } from "react";
import { Plus, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const MAX_TASK_LENGTH = 500;

interface AddTodoFormProps {
  onAdd: () => void;
}

export const AddTodoForm = ({ onAdd }: AddTodoFormProps) => {
  const [task, setTask] = useState("");
  const [deadline, setDeadline] = useState<Date>();
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!task.trim()) {
      toast.error("Please enter a task");
      return;
    }

    if (task.trim().length > MAX_TASK_LENGTH) {
      toast.error(`Task must be less than ${MAX_TASK_LENGTH} characters`);
      return;
    }

    setIsAdding(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("You must be logged in to add todos");
      setIsAdding(false);
      return;
    }

    const { error } = await supabase
      .from("todos")
      .insert([{ 
        task: task.trim(), 
        user_id: user.id,
        deadline: deadline?.toISOString()
      }]);

    if (error) {
      toast.error("Failed to add todo");
    } else {
      toast.success("Todo added!");
      setTask("");
      setDeadline(undefined);
      onAdd();
    }
    
    setIsAdding(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div className="flex-1 flex flex-col gap-1">
          <Input
            type="text"
            placeholder="What needs to be done?"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            disabled={isAdding}
            maxLength={MAX_TASK_LENGTH}
          />
          <span className="text-xs text-muted-foreground ml-1">
            {task.length}/{MAX_TASK_LENGTH} characters
          </span>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              disabled={isAdding}
              className={cn(
                "justify-start text-left font-normal",
                !deadline && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {deadline ? format(deadline, "PPP") : "Deadline"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={deadline}
              onSelect={setDeadline}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        <Button type="submit" disabled={isAdding || !task.trim()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
    </form>
  );
};
