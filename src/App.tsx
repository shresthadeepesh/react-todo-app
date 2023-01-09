import React, { useEffect, useState } from "react";
import setupIndexedDB, { useIndexedDBStore } from "use-indexeddb";
import { idbConfig } from "./config/config";
import dayjs from "dayjs";
import { Todo } from "./models/Todo";
import { useForm } from "react-hook-form";
import Item from "./components/Todo/item";

function App() {
  const { add, deleteByID, getAll, getByID, update } =
    useIndexedDBStore("todos");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editTodo, setEditTodo] = useState<Todo>();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    setupIndexedDB(idbConfig)
      .then(() => {
        console.log("Db connected");
      })
      .catch((err) => {
        console.log("Error", err);
      });

    getTodos();
  }, []);

  const getTodos = async () => {
    const todo = (await getAll()) as Todo[];
    setTodos(todo);
  };

  const onSubmit = (data: Partial<Todo>) => {
    //update
    if (editTodo) {
      const todo = {
        id: editTodo.id,
        ...data,
        status: false,
        createdAt: dayjs(),
        updatedAt: dayjs(),
      } as Todo;

      //update db
      update(todo).then(() => {
        //update state
        const updatedTodos = todos.map((el) =>
          el.id === todo.id
            ? {
                ...todo,
              }
            : el
        );
        setTodos(updatedTodos);
        reset();
      });
    }
    //add
    else {
      const todo = {
        ...data,
        status: false,
        createdAt: dayjs(),
        updatedAt: dayjs(),
      } as Todo;

      //insert to database
      add(todo).then((res) => {
        const fromDbTodoId = res;
        const updatedTodos = [
          {
            ...todo,
            id: fromDbTodoId,
          },
          ...todos,
        ];
        setTodos(updatedTodos);
        reset();
      });
    }
  };

  const handleStatusChange = (id: number) => {
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
  };

  const handleDelete = (id: number) => {
    getByID(id).then((res) => {
      //update database
      deleteByID(id);

      //update state
      const updatedTodos = todos.filter((el) => el.id !== id);
      setTodos(updatedTodos);
    });
  };

  const handleEdit = (id: number) => {
    getByID(id).then((res) => {
      const todo = res as Todo;
      //update state
      setEditTodo(todo);
      setValue("title", todo.title);
      setValue("description", todo.title);
    });
  };

  return (
    <div className="App container">
      <div className="flex flex-wrap">
        <div className="w-full md:w-1/3">
          <div className="p-5 m-5 bg-white bg-opacity-20 backdrop-blur-lg rounded drop-shadow-lg transition-shadow duration-500 shadow-md hover:shadow-xl sticky top-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div className="space-y-3">
                <label htmlFor="title">Title</label>
                <input
                  className="w-full text-xl px-5 py-4 rounded-xl"
                  type="text"
                  {...register("title", {
                    required: "The title field is required.",
                  })}
                  placeholder="Enter todo here..."
                  autoFocus={true}
                  aria-invalid={errors.title ? "true" : "false"}
                />
                {errors.title && (
                  <small className="text-red-900">
                    The title field is required.
                  </small>
                )}
              </div>

              <div className="space-y-3">
                <label htmlFor="description">Description</label>
                <input
                  className="w-full text-xl px-5 py-4 rounded-xl"
                  type="text"
                  {...register("description", {
                    required: "The description field is required.",
                  })}
                  placeholder="Enter todo description here..."
                  aria-invalid={errors.description ? "true" : "false"}
                />
                {errors.description && (
                  <small className="text-red-900">
                    The description field is required.
                  </small>
                )}
              </div>

              <div className="space-x-2 space-y-6">
                <input className="btn bg-[#219ebc]" type="submit" />
                <input className="btn bg-[#8ecae6]" type="reset" />
              </div>
            </form>
          </div>
        </div>
        <div className="w-full md:w-2/3">
          {todos.map((todo) => (
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
  );
}

export default App;
