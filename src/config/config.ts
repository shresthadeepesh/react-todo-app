// Database Configuration
export const idbConfig = {
  databaseName: "todo-db",
  version: 1,
  stores: [
    {
      name: "todos",
      id: { keyPath: "id", autoIncrement: true },
      indices: [
        { name: "title", keyPath: "title", options: { unique: false } },
        {
          name: "description",
          keyPath: "description",
          options: {
            unique: false,
          },
        },
        {
          name: "status",
          keyPath: "status",
          options: {
            unique: false,
          },
        },
        {
          name: "createdAt",
          keyPath: "createdAt",
        },
        {
          name: "updatedAt",
          keyPath: "updatedAt",
        },
      ],
    },
  ],
};
