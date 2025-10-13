import { Button } from "@/components/ui/button";

type FilterType = "all" | "active" | "completed";

interface FilterControlsProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const FilterControls = ({ currentFilter, onFilterChange }: FilterControlsProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant={currentFilter === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("all")}
      >
        All
      </Button>
      <Button
        variant={currentFilter === "active" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("active")}
      >
        Active
      </Button>
      <Button
        variant={currentFilter === "completed" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("completed")}
      >
        Completed
      </Button>
    </div>
  );
};
