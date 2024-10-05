import dayjs from "dayjs";
import { FC, useEffect, useState } from "react";
import { Todo } from "../../models/Todo";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";

dayjs.extend(relativeTime);
dayjs.extend(duration);

interface TodoItemProps {
  todo: Todo;
  handleStatusChange: (id: number) => void;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
  handleStart: (id: number) => void;
  handleEnd: (id: number) => void;
}

const TodoItem: FC<TodoItemProps> = ({
  todo: {
    id,
    title,
    description,
    status,
    remindIn,
    createdAt,
    updatedAt,
    inProgress,
    startedAt,
    endedAt,
  },
  handleDelete,
  handleEdit,
  handleStatusChange,
  handleStart,
  handleEnd,
}) => {
  //setting an infinite alarm
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "granted") {
      const interval = setInterval(() => {
        if (status || dayjs(remindIn).isBefore(dayjs())) {
          clearInterval(interval);
        } else if (!status && dayjs(remindIn).isSame(dayjs(), "minute")) {
          new Notification(title, {
            body: description,
            icon: "",
          });
          clearInterval(interval);
        }
      }, 1000 * 60); //1 minute

      return () => clearInterval(interval);
    }
  }, [description, remindIn, status, title]);

  const handlePlayPauseClick = () => {
    if (inProgress) {
      handleEnd(id);
    } else {
      handleStart(id);
    }
  };

  return (
    <div className="p-4 m-3 transition-shadow duration-500 bg-white shadow-md rounded-xl bg-opacity-20 backdrop-blur-lg drop-shadow-lg hover:shadow-xl">
      <div className="flex space-x-12">
        <div className="flex items-center">
          <input
            type="checkbox"
            onChange={() => handleStatusChange(id)}
            checked={status}
          />
        </div>
        <div className="space-y-3 text-white">
          <h3 className="text-3xl">{title}</h3>

          <div className="flex justify-between place-items-center">
            <div className="">
              Created At: {dayjs(createdAt).format("MM/DD/YYYY H:M A")}
            </div>
            <div className="">
              Updated At: {dayjs(updatedAt).format("MM/DD/YYYY H:M A")}
            </div>
          </div>

          <div className="text-lg">{description}</div>
          {remindIn ? (
            <div className="text-sm">Remind: {dayjs(remindIn).fromNow()}</div>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-end mt-4 space-x-2">
        {endedAt ? (
          <div className="text-white">
            Completed in: {dayjs(endedAt).diff(dayjs(startedAt))} ms
          </div>
        ) : null}
        <button
          onClick={handlePlayPauseClick}
          className="px-5 py-2 text-white border border-green-300 rounded-lg"
        >
          {endedAt ? (
            <div className="">🔃</div>
          ) : (
            <>
              {inProgress ? (
                <>
                  <div className="flex space-x-2">
                    <div className="">⏹️</div>
                    <div className="">
                      <ElapsedTime startedAt={startedAt} />
                    </div>
                  </div>
                </>
              ) : (
                "▶️"
              )}
            </>
          )}
        </button>
        <button
          onClick={() => handleEdit(id)}
          className="px-5 py-2 bg-green-300 rounded-lg"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(id)}
          className="px-5 py-2 bg-red-400 rounded-lg"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const ElapsedTime = ({ startedAt }: { startedAt: string }) => {
  const [elapsedTime, setElapsedTime] = useState(dayjs.duration(0));

  useEffect(() => {
    // Update the elapsed time every second
    const timer = setInterval(() => {
      const now = dayjs();
      const diff = now.diff(dayjs(startedAt));

      setElapsedTime(dayjs.duration(diff));
    }, 1000);

    return () => clearInterval(timer); // Clean up the interval on unmount
  }, [startedAt]);

  return (
    <>
      <div className="flex space-x-1">
        {elapsedTime.days() > 0 ? (
          <span>{elapsedTime.days()} days,</span>
        ) : null}
        {elapsedTime.hours() > 0 ? (
          <span>{elapsedTime.hours()} hours,</span>
        ) : null}
        {elapsedTime.minutes() > 0 ? (
          <span>{elapsedTime.minutes()} minutes,</span>
        ) : null}
        <span className="">
          {elapsedTime.seconds() > 0 ? (
            <span>{elapsedTime.seconds()} seconds</span>
          ) : null}
        </span>
      </div>
    </>
  );
};

export default TodoItem;
