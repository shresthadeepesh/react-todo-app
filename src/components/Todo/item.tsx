import { FC } from "react";
import { Todo } from "../../models/Todo";

interface ItemProps {
  todo: Todo;
  handleStatusChange: (id: number) => void;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
}

const Item: FC<ItemProps> = ({
  todo: { id, title, description, status },
  handleDelete,
  handleEdit,
  handleStatusChange,
}) => {
  return (
    <div className="p-5 m-5 bg-white bg-opacity-20 backdrop-blur-lg rounded drop-shadow-lg transition-shadow duration-500 shadow-md hover:shadow-xl">
      <div className="flex justify-between">
        <div className="flex space-x-12">
          <div className="flex items-center">
            <input
              type="checkbox"
              onChange={() => handleStatusChange(id)}
              checked={status}
            />
          </div>
          <div className="text-white">
            <h3 className="text-2xl">{title}</h3>
            <p className="text-xl">{description}</p>
          </div>
        </div>

        <div className="space-x-5 items-center flex">
          <button
            onClick={() => handleEdit(id)}
            className="bg-green-300 px-5 py-2 rounded-lg"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(id)}
            className="bg-red-400 px-5 py-2 rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Item;
