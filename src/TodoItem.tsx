import React from "react";
import { Todo } from "./types";

type Props = {
  todo: Todo;
  updateIsDone: (id: string, value: boolean) => void;
  edit: (todo: Todo) => void;
};

const deadLine = (todo: Todo) => {
  if (!todo.deadline) {
    return "期限なし";
  }
  return todo.deadline.toLocaleString();
};

const out = (todo: Todo) => {
  if (!todo.deadline) return "";
  if (todo.deadline < new Date()) return "text-red-800";
  if (todo.deadline.getTime() - new Date().getTime() <= 604800000)
    return "text-red-400";
  return "";
};

const priori = (todo: Todo) => {
  if (todo.priority == 3) return "text-red-600";
  return "";
};

const TodoItem = (props: Props) => {
  const todo = props.todo;
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={todo.isDone}
          onChange={(e) => props.updateIsDone(todo.id, e.target.checked)}
          className="mr-1.5 cursor-pointer"
        />
        {todo.name}&emsp;|&emsp;
        <div className={priori(todo)}>{"★".repeat(todo.priority)}</div>
        &emsp;|&emsp;
        <div className={out(todo)}>{deadLine(todo)}</div>
      </div>
      <div>
        <button
          onClick={() => props.edit(todo)}
          className="flex rounded-md bg-blue-500 px-2 py-1 text-sm font-bold text-white hover:bg-blue-600"
        >
          編集
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
