import React, { useCallback, useEffect, useMemo, useState } from "react";
import setupIndexedDB, { useIndexedDBStore } from "use-indexeddb";
import { idbConfig } from "./config/config";
import dayjs from "dayjs";
import { Todo } from "./models/Todo";
import { useForm } from "react-hook-form";
import Item from "./components/Todo/item";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Form from "./components/Todo/form";

function App() {
  const { deleteByID, getAll, getByID, update } = useIndexedDBStore("todos");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editTodo, setEditTodo] = useState<Todo>();
  const { setValue } = useForm();
  const [completedAnimation] = useAutoAnimate<HTMLDivElement>();
  const [uncompletedAnimation] = useAutoAnimate<HTMLDivElement>();
  const [formAnimate] = useAutoAnimate<HTMLDivElement>();

  const completedTodo = useMemo(() => todos.filter((el) => el.status), [todos]);
  const uncompletedTodo = useMemo(
    () => todos.filter((el) => !el.status),
    [todos]
  );

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
        //update database
        update({
          ...todo,
          status: !todo.status,
        });

        //update state
        const updatedTodos = todos.map((el) =>
          el.id === id
            ? {
                ...el,
                status: !todo.status,
              }
            : el
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
    <div className="App container">
      <div className="flex flex-wrap">
        <div className="w-full md:w-1/3">
          <div
            className="p-5 m-5 bg-white bg-opacity-20 backdrop-blur-lg rounded drop-shadow-lg transition-shadow duration-500 shadow-md hover:shadow-xl sticky top-10"
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
            <button className="btn bg-blue-500" onClick={handleExport}>
              Export
            </button>
          </div>
          <div className="" ref={uncompletedAnimation}>
            {uncompletedTodo.map((todo) => (
              <Item
                key={todo.id}
                todo={todo}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
                handleStatusChange={handleStatusChange}
              />
            ))}
          </div>
          <div className="" ref={completedAnimation}>
            {completedTodo.map((todo) => (
              <Item
                key={todo.id}
                todo={todo}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
                handleStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
