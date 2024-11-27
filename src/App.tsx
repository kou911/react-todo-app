import { useState, useEffect } from "react";
import { Todo } from "./types";
import { initTodos } from "./initTodos";
import WelcomeMessage from "./WelcomeMessage";
import TodoList from "./TodoList";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge"; // ◀◀ 追加
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // ◀◀ 追加
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"; // ◀◀ 追加
// import { Console } from "console";

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]); // ◀◀ 編集
  const [newTodoName, setNewTodoName] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState(3);
  const [newTodoDeadline, setNewTodoDeadline] = useState<Date | null>(null);
  const [newTodoNameError, setNewTodoNameError] = useState("");
  const [buttonDisable, setButtonDisable] = useState("Err");
  const [mode, setMode] = useState("");
  const [id, setId] = useState("");

  const [initialized, setInitialized] = useState(false); // ◀◀ 追加
  const localStorageKey = "TodoApp"; // ◀◀ 追加

  // App コンポーネントの初回実行時のみLocalStorageからTodoデータを復元
  useEffect(() => {
    const todoJsonStr = localStorage.getItem(localStorageKey);
    if (todoJsonStr && todoJsonStr !== "[]") {
      const storedTodos: Todo[] = JSON.parse(todoJsonStr);
      const convertedTodos = storedTodos.map((todo) => ({
        ...todo,
        deadline: todo.deadline ? new Date(todo.deadline) : null,
      }));
      setTodos(todoSort(convertedTodos));
    } else {
      // LocalStorage にデータがない場合は initTodos をセットする
      setTodos(todoSort(initTodos));
    }
    setInitialized(true);
  }, []);

  // 状態 todos または initialized に変更があったときTodoデータを保存
  useEffect(() => {
    if (initialized) {
      localStorage.setItem(localStorageKey, JSON.stringify(todos));
    }
  }, [todos, initialized]);

  const uncompletedCount = todos.filter((todo: Todo) => !todo.isDone).length;

  // ▼▼ 追加
  const isValidTodoName = (name: string): string => {
    if (name.length < 2 || name.length > 16) {
      return "2文字以上、16文字以内で入力してください";
    } else {
      return "";
    }
  };

  const todoSort = (todos: Todo[]) => {
    const sortedArray: {
      id: string;
      name: string;
      isDone: boolean;
      priority: number;
      deadline: Date | null;
    }[] = todos.sort((n1, n2) => {
      if (n1.deadline == null && n2.deadline == null) {
        if (n1.priority > n2.priority) {
          return -1;
        }
        if (n1.priority < n2.priority) {
          return 1;
        }
      }
      if (n1.deadline == null) {
        return 1;
      }

      if (n2.deadline == null) {
        return -1;
      }

      if (n1.deadline > n2.deadline) {
        return 1;
      }

      if (n1.deadline < n2.deadline) {
        return -1;
      }

      if (n1.deadline == n2.deadline) {
        if (n1.priority > n2.priority) {
          return 1;
        }
        if (n1.priority < n2.priority) {
          return -1;
        }
      }

      return 0;
    });
    return sortedArray;
  };

  const updateNewTodoName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoNameError(isValidTodoName(e.target.value)); // ◀◀ 追加
    setButtonDisable(isValidTodoName(e.target.value));
    setNewTodoName(e.target.value);
  };

  const updateNewTodoPriority = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoPriority(Number(e.target.value));
  };

  const updateDeadline = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dt = e.target.value; // UIで日時が未設定のときは空文字列 "" が dt に格納される
    setNewTodoDeadline(dt === "" ? null : new Date(dt));
  };

  const updateIsDone = (id: string, value: boolean) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isDone: value }; // スプレッド構文
      } else {
        return todo;
      }
    });
    setTodos(todoSort(updatedTodos));
  };

  const edit = (todo: Todo) => {
    setNewTodoName(todo.name);
    setNewTodoPriority(todo.priority);
    setNewTodoDeadline(todo.deadline);
    setId(todo.id);
    setMode("edit");
    setNewTodoNameError("");
    setButtonDisable("");
  };

  const removeCompletedTodos = () => {
    const updatedTodos = todos.filter((todo) => !todo.isDone);
    setTodos(todoSort(updatedTodos));
  };

  const remove = (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(todoSort(updatedTodos));
  };

  const addNewTodo = () => {
    // ▼▼ 編集
    const err = isValidTodoName(newTodoName);
    if (err !== "") {
      setNewTodoNameError(err);
      setButtonDisable(err);
      return;
    }
    const newTodo: Todo = {
      id: uuid(),
      name: newTodoName,
      isDone: false,
      priority: newTodoPriority,
      deadline: newTodoDeadline,
    };

    const updatedTodos = [...todos, newTodo];
    setTodos(todoSort(updatedTodos));
    setNewTodoName("");
    setNewTodoPriority(3);
    setNewTodoDeadline(null);
  };

  const updateTodo = () => {
    const err = isValidTodoName(newTodoName);
    if (err !== "") {
      setNewTodoNameError(err);
      setButtonDisable(err);
      return;
    }

    const newTodos = todos.filter((todo) => todo.id !== id);
    const newTodo: Todo = {
      id: uuid(),
      name: newTodoName,
      isDone: false,
      priority: newTodoPriority,
      deadline: newTodoDeadline,
    };

    const updatedTodos = [...newTodos, newTodo];
    setTodos(todoSort(updatedTodos));
    setNewTodoName("");
    setNewTodoPriority(3);
    setNewTodoDeadline(null);
    setMode("");
    setButtonDisable("Err");
  };

  return (
    <div className="mx-4 mt-10 max-w-2xl md:mx-auto">
      <h1 className="mb-4 text-2xl font-bold">TodoApp</h1>
      <div className="mb-4">
        <WelcomeMessage uncompletedCount={uncompletedCount} />
      </div>
      <TodoList
        todos={todos}
        updateIsDone={updateIsDone}
        edit={edit}
        remove={remove}
      />

      <button
        type="button"
        onClick={removeCompletedTodos}
        className={twMerge(
          "mt-5 rounded-md bg-red-500 px-3 py-1 font-bold text-white hover:bg-red-600",
          !todos.filter((todo) => todo.isDone).length &&
            "cursor-not-allowed opacity-50"
        )}
      >
        完了済みのタスクを削除
      </button>

      <div className="mt-5 space-y-2 rounded-md border p-3">
        {mode == "edit" && <h2 className="text-lg font-bold">タスクの編集</h2>}
        {mode != "edit" && (
          <h2 className="text-lg font-bold">新しいタスクの追加</h2>
        )}
        {/* 編集: ここから... */}
        <div>
          <div className="flex items-center space-x-2">
            <label className="font-bold" htmlFor="newTodoName">
              名前
            </label>
            <input
              id="newTodoName"
              type="text"
              value={newTodoName}
              onChange={updateNewTodoName}
              className={twMerge(
                "grow rounded-md border p-2",
                newTodoNameError && "border-red-500 outline-red-500"
              )}
              placeholder="2文字以上16文字以内で入力してください"
            />
          </div>
          {newTodoNameError && (
            <div className="ml-10 flex items-center space-x-1 text-sm font-bold text-red-500 ">
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                className="mr-0.5"
              />
              <div>{newTodoNameError}</div>
            </div>
          )}
        </div>
        {/* ...ここまで */}

        <div className="flex gap-5">
          <div className="font-bold">優先度</div>
          {[1, 2, 3].map((value) => (
            <label key={value} className="flex items-center space-x-1">
              <input
                id={`priority-${value}`}
                name="priorityGroup"
                type="radio"
                value={value}
                checked={newTodoPriority === value}
                onChange={updateNewTodoPriority}
              />
              <span>{value}</span>
            </label>
          ))}
        </div>

        <div className="flex items-center gap-x-2">
          <label htmlFor="deadline" className="font-bold">
            期限
          </label>
          <input
            type="datetime-local"
            id="deadline"
            value={
              newTodoDeadline
                ? dayjs(newTodoDeadline).format("YYYY-MM-DDTHH:mm:ss")
                : ""
            }
            onChange={updateDeadline}
            className="rounded-md border border-gray-400 px-2 py-0.5"
          />
        </div>

        {mode == "" && (
          <button
            type="button"
            onClick={addNewTodo}
            className={twMerge(
              "rounded-md bg-indigo-500 px-3 py-1 font-bold text-white hover:bg-indigo-600",
              buttonDisable && "cursor-not-allowed opacity-50"
            )}
          >
            追加
          </button>
        )}

        {mode && (
          <div>
            <button
              type="button"
              onClick={updateTodo}
              className={twMerge(
                "rounded-md bg-indigo-500 px-3 py-1 font-bold text-white hover:bg-indigo-600",
                buttonDisable && "cursor-not-allowed opacity-50"
              )}
            >
              編集
            </button>

            <button
              type="button"
              onClick={() => {
                setNewTodoName("");
                setNewTodoPriority(3);
                setNewTodoDeadline(null);
                setMode("");
                setButtonDisable("Err");
              }}
              className={twMerge(
                "rounded-md bg-indigo-500 px-3 py-1 font-bold text-white hover:bg-indigo-600",
                buttonDisable && "cursor-not-allowed opacity-50"
              )}
            >
              キャンセル
            </button>

            <button
              type="button"
              onClick={() => {
                remove(id);
                setNewTodoName("");
                setNewTodoPriority(3);
                setNewTodoDeadline(null);
                setMode("");
                setButtonDisable("Err");
              }}
              className={twMerge(
                "rounded-md bg-red-500 px-3 py-1 font-bold text-white hover:bg-red-600",
                buttonDisable && "cursor-not-allowed opacity-50"
              )}
            >
              削除
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
