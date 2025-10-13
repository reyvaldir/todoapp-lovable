import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AddTodoFormProps {
  onAdd: () => void;
}

export const AddTodoForm = ({ onAdd }: AddTodoFormProps) => {
  const [task, setTask] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!task.trim()) {
      toast.error("Please enter a task");
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
      .insert([{ task: task.trim(), user_id: user.id }]);

    if (error) {
      toast.error("Failed to add todo");
      console.error("Error adding todo:", error);
    } else {
      toast.success("Todo added!");
      setTask("");
      onAdd();
    }
    
    setIsAdding(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="What needs to be done?"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        disabled={isAdding}
        className="flex-1"
      />
      <Button type="submit" disabled={isAdding || !task.trim()}>
        <Plus className="h-4 w-4 mr-2" />
        Add Task
      </Button>
    </form>
  );
};
