
export type TaskCategory = 'red' | 'green' | 'blue' | 'yellow' | 'purple';

export interface Task {
  id: string;
  title: string;
  description?: string;
  day: string;
  completed: boolean;
  category: TaskCategory;
  createdAt: Date;
}
