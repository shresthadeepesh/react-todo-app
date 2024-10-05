import { Todo } from "./models/Todo";

  export const groupByUpdatedAt = (todos) => {
    return todos.reduce((group, todo) => {
        // Extract the updatedAt date (use only the date part, not the time)
        const date = todo.updatedAt.split('T')[0]; // Assumes updatedAt is in ISO 8601 format
      
        if (!group[date]) {
          group[date] = [];
        }
        group[date].push(todo);
        return group;
      }, {} as Record<string, Todo[]>);
  }