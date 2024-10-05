import { FC, useCallback, useEffect, useState, Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { useIndexedDBStore } from "use-indexeddb";
import { Todo } from "../../models/Todo";
import dayjs from "dayjs";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface FormProps {
  editTodo?: Todo;
  setEditTodo: Dispatch<SetStateAction<Todo | undefined>>;
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
}

const Form: FC<FormProps> = ({ editTodo, setEditTodo, todos, setTodos }) => {
  const { add, update } = useIndexedDBStore("todos");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  const [isReminder, setIsReminder] = useState(false);
  const [reminderAnimate] = useAutoAnimate({
    //
  });

  useEffect(() => {
    setValue("title", editTodo?.title);
    setValue("description", editTodo?.description);
    if (editTodo?.remindIn) {
      setIsReminder(true);
      setValue(
        "remindIn",
        dayjs(editTodo?.remindIn).format("YYYY-MM-DDThh:mm")
      );
    } else {
      setIsReminder(false);
      setValue("remindIn", null);
    }
  }, [editTodo, setValue]);

  const resetForm = useCallback(() => {
    if (editTodo) {
      setEditTodo(undefined);
    }
    reset();
  }, [editTodo, reset, setEditTodo]);

  const onSubmit = useCallback(
    (data: Partial<Todo>) => {
      //update
      if (editTodo) {
        const todo = {
          id: editTodo.id,
          ...data,
          status: false,
          remindIn: isReminder ? dayjs(data.remindIn).toISOString() : null,
          updatedAt: dayjs().toISOString(),
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
          remindIn: isReminder ? dayjs(data.remindIn).toISOString() : null,
          createdAt: dayjs().toISOString(),
          updatedAt: dayjs().toISOString(),
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
    },
    [add, editTodo, reset, setTodos, todos, update]
  );

  const handleReminderChange = () => {
    setIsReminder(!isReminder);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="space-y-3">
        <label htmlFor="title" className="text-white">
          Title:
        </label>
        <input
          className="w-full px-5 py-4 text-xl rounded-xl"
          type="text"
          {...register("title", {
            required: "The title field is required.",
          })}
          placeholder="Enter todo here..."
          autoFocus={true}
          aria-invalid={errors.title ? "true" : "false"}
        />
        {errors.title && (
          <small className="text-red-500">The title field is required.</small>
        )}
      </div>

      <div className="space-y-3">
        <label htmlFor="description" className="text-white">
          Description:
        </label>
        <textarea
          className="w-full h-56 px-5 py-4 text-xl rounded-xl"
          {...register("description", {
            required: "The description field is required.",
          })}
          placeholder="Enter todo description here..."
          aria-invalid={errors.description ? "true" : "false"}
        />
        {errors.description && (
          <small className="text-red-500">
            The description field is required.
          </small>
        )}
      </div>

      <div className="space-y-3">
        <label htmlFor="description" className="text-white">
          Reminder
        </label>
        <input
          checked={isReminder}
          onChange={handleReminderChange}
          className="w-5 h-5 px-5 py-4 mx-5 text-xl rounded-xl "
          type="checkbox"
        />
      </div>

      <div className="" ref={reminderAnimate}>
        {isReminder ? (
          <div className="space-y-3">
            <label htmlFor="remindIn" className="text-white">
              Remind In:
            </label>
            <input
              className="w-full px-5 py-4 text-xl rounded-xl"
              type="datetime-local"
              {...register("remindIn")}
            />
          </div>
        ) : null}
      </div>

      <div className="space-x-2 space-y-6">
        <input className="btn bg-[#219ebc]" type="submit" />
        <button className="btn bg-[#8ecae6]" type="button" onClick={resetForm}>
          Reset
        </button>
      </div>
    </form>
  );
};

export default Form;
