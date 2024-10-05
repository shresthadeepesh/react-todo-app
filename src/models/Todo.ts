export interface Todo {
  id: number;
  title: string;
  description: string;
  status: boolean;
  remindIn: string;
  createdAt: string;
  updatedAt: string;
  inProgress: boolean;
  startedAt: string | null;
  endedAt: string | null;
}
