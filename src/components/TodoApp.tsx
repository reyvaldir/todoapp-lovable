import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { AddTodoForm } from "./AddTodoForm";
import { FilterControls } from "./FilterControls";
import { TodoList } from "./TodoList";
import { toast } from "sonner";

type FilterType = "all" | "active" | "completed";

interface Todo {
  id: string;
  task: string;
  is_complete: boolean;
  created_at: string;
}

export const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [isLoading, setIsLoading] = useState(true);

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load todos");
    } else {
      setTodos(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTodos();

    // Set up real-time subscription
    const channel = supabase
      .channel("todos_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "todos",
        },
        () => {
          fetchTodos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogout = async () => {
    try {
      // Clear local session first
      await supabase.auth.signOut({ scope: 'local' });
      // The onAuthStateChange listener will handle navigation
    } catch (error) {
      // Even if server signout fails, clear local session
      console.error('Logout error:', error);
      // Force navigation to auth page
      window.location.href = '/auth';
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.is_complete;
    if (filter === "completed") return todo.is_complete;
    return true;
  });

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Get It Done</h1>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
        </div>

        {/* Add Todo Form */}
        <div className="mb-6">
          <AddTodoForm onAdd={fetchTodos} />
        </div>

        {/* Filter Controls */}
        <div className="mb-4">
          <FilterControls currentFilter={filter} onFilterChange={setFilter} />
        </div>

        {/* Todo List */}
        <div className="bg-card rounded-lg shadow-md p-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading your todos...
            </div>
          ) : (
            <TodoList todos={filteredTodos} onUpdate={fetchTodos} />
          )}
        </div>
      </div>
    </div>
  );
};
