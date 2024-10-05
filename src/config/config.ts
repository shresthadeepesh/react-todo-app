// Database Configuration
export const idbConfig = {
  databaseName: "todo-db",
  version: 1,
  stores: [
    {
      name: "groups",
      id: { keyPath: "id", autoIncrement: false },
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
          name: "createdAt",
          keyPath: "createdAt",
        },
        {
          name: "updatedAt",
          keyPath: "updatedAt",
        },
      ],
    },
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
        {
          name: "inProgress",
          keyPath: "inProgress",
          options: {
            unique: false,
          },
        },
        {
          name: "startedAt",
          keyPath: "startedAt",
        },
        {
          name: "endedAt",
          keyPath: "endedAt",
        },
      ],
    },
  ],
};
