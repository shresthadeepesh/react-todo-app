import React, { useCallback, useEffect, useMemo, useState } from "react";
import setupIndexedDB, { useIndexedDBStore } from "use-indexeddb";
import { idbConfig } from "./config/config";
import dayjs from "dayjs";
import { Todo } from "./models/Todo";
import { useForm } from "react-hook-form";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Form from "./components/Todo/form";
import { groupByUpdatedAt } from "./helper";
import TodoList from "./components/Todo/list";

function App() {
  const { deleteByID, getAll, getByID, update } = useIndexedDBStore("todos");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editTodo, setEditTodo] = useState<Todo>();
  const { setValue } = useForm();
  const [formAnimate] = useAutoAnimate<HTMLDivElement>();

  const groupedTodos = useMemo(() => {
    return groupByUpdatedAt(todos);
  }, [todos]);

  const getTodos = useCallback(async () => {
    const todo = (await getAll()) as Todo[];
    const sortTodo = todo.sort((a, b) =>
      dayjs(a.updatedAt).isAfter(b.updatedAt) ? 1 : -1
    );
    setTodos(sortTodo);
  }, [getAll]);

  useEffect(() => {
    setupIndexedDB(idbConfig)
      .then(() => {
        console.log("Db connected");
      })
      .catch((err) => {
        console.log("Error", err);
      });

    getTodos();
  }, [getTodos]);

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().catch((err) => {
        console.log("Notification errors...", err);
      });
    }
  }, []);

  const handleStatusChange = useCallback(
    (id: number) => {
      getByID(id).then((res) => {
        const todo = res as Todo;

        const updatedTodo = {
          ...todo,
          status: !todo.status,
          updatedAt: dayjs().toISOString(),
        };

        //update database
        update(updatedTodo);

        //update state
        const updatedTodos = todos.map((el) =>
          el.id === id ? updatedTodo : el
        );
        setTodos(updatedTodos);
      });
    },
    [getByID, todos, update]
  );

  const handleStart = useCallback(
    (id: number) => {
      getByID(id).then((res) => {
        const todo = res as Todo;

        const updatedTodo = {
          ...todo,
          inProgress: true,
          startedAt: dayjs().toISOString(),
          endedAt: null,
        };

        //update database
        update(updatedTodo);

        //update state
        const updatedTodos = todos.map((el) =>
          el.id === id ? updatedTodo : el
        );
        setTodos(updatedTodos);
      });
    },
    [getByID, todos, update]
  );

  const handleEnd = useCallback(
    (id: number) => {
      getByID(id).then((res) => {
        const todo = res as Todo;

        const updatedTodo = {
          ...todo,
          updatedAt: dayjs().toISOString(),
          inProgress: false,
          endedAt: dayjs().toISOString(),
        };

        //update database
        update(updatedTodo);

        //update state
        const updatedTodos = todos.map((el) =>
          el.id === id ? updatedTodo : el
        );
        setTodos(updatedTodos);
      });
    },
    [getByID, todos, update]
  );

  const handleDelete = useCallback(
    (id: number) => {
      getByID(id).then((res) => {
        //update database
        deleteByID(id);

        //update state
        const updatedTodos = todos.filter((el) => el.id !== id);
        setTodos(updatedTodos);
      });
    },
    [getByID, deleteByID, todos]
  );

  const handleEdit = useCallback(
    (id: number) => {
      getByID(id).then((res) => {
        const todo = res as Todo;
        //update state
        setEditTodo(todo);
      });
    },
    [getByID, setValue]
  );

  const handleExport = useCallback(() => {
    const buffer = new Blob([decodeURIComponent(JSON.stringify(todos))], {
      type: "application/json;charset=utf-8",
    });

    const link = document.createElement("a");
    link.download = "todos.json";
    const obj = window.URL.createObjectURL(buffer);
    link.href = obj;
    link.download = "todos.json";
    link.click();
    window.URL.revokeObjectURL(obj);
  }, [todos]);

  return (
    <div className="container App">
      <div className="flex flex-wrap">
        <div className="w-full md:w-1/3">
          <div
            className="sticky p-5 m-5 transition-shadow duration-500 bg-white shadow-md bg-opacity-20 backdrop-blur-lg rounded-xl drop-shadow-lg hover:shadow-xl top-10"
            ref={formAnimate}
          >
            <Form
              editTodo={editTodo}
              setEditTodo={setEditTodo}
              todos={todos}
              setTodos={setTodos}
            />
          </div>
        </div>
        <div className="w-full md:w-2/3">
          <div className="flex justify-end my-5 space-x-2">
            <button className="bg-blue-500 btn" onClick={handleExport}>
              Export
            </button>
          </div>

          {Object.entries(groupedTodos).map(
            ([date, todos]: [string, Todo[]]) => (
              <div className="py-5 my-5 border rounded-xl" key={date}>
                <div className="px-3 mx-3 text-white">
                  {dayjs(date).format("DD MMM, YYYY")}
                </div>
                <TodoList
                  todos={todos}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                  handleStatusChange={handleStatusChange}
                  handleEnd={handleEnd}
                  handleStart={handleStart}
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
