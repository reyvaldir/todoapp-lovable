import { TodoItem } from "./TodoItem";

interface Todo {
  id: string;
  task: string;
  is_complete: boolean;
  deadline?: string;
  created_at: string;
}

interface TodoListProps {
  todos: Todo[];
  onUpdate: () => void;
}

export const TodoList = ({ todos, onUpdate }: TodoListProps) => {
  if (todos.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">You're all caught up! 🎉</p>
        <p className="text-sm mt-2">Add a new task to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          task={todo.task}
          isComplete={todo.is_complete}
          deadline={todo.deadline}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};
