import { Todo } from "@/models/Todo";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import React, { FC, useMemo } from "react";
import TodoItem from "./item";

interface TodoListProps {
  todos: Todo[];
  handleStatusChange: (id: number) => void;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
  handleStart: (id: number) => void;
  handleEnd: (id: number) => void;
}

const TodoList: FC<TodoListProps> = ({
  todos,
  handleDelete,
  handleEdit,
  handleStatusChange,
  handleStart,
  handleEnd,
}) => {
  const [completedAnimation] = useAutoAnimate<HTMLDivElement>();
  const [uncompletedAnimation] = useAutoAnimate<HTMLDivElement>();

  const completedTodo = useMemo(() => todos.filter((el) => el.status), [todos]);
  const uncompletedTodo = useMemo(
    () => todos.filter((el) => !el.status),
    [todos]
  );

  return (
    <>
      <div className="" ref={uncompletedAnimation}>
        {uncompletedTodo.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            handleStatusChange={handleStatusChange}
            handleStart={handleStart}
            handleEnd={handleEnd}
          />
        ))}
      </div>
      <div className="" ref={completedAnimation}>
        {completedTodo.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            handleStatusChange={handleStatusChange}
            handleStart={handleStart}
            handleEnd={handleEnd}
          />
        ))}
      </div>
    </>
  );
};

export default TodoList;
