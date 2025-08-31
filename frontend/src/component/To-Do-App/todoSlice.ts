import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

export type Filter = "all" | "active" | "completed";

// Load from localStorage
// const savedTodos = localStorage.getItem("todos");
const loadTodos = (): Todo[] => {
  try {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};
interface TodoState {
  list: Todo[];
  filter: Filter;
}

const initialState: TodoState = {
  list:loadTodos(),
  filter: "all",
};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      // state.list.push({
      //   id: Date.now().toString(),
      //   text: action.payload,
      //   completed: false,
   //   });

     const newTodo: Todo = {
        id: Date.now().toString(),
        text: action.payload,
        completed: false,
      };
      state.list.push(newTodo);
      localStorage.setItem("todos", JSON.stringify(state.list)); // ✅ save
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      // const todo = state.list.find((t) => t.id === action.payload);
      // if (todo) todo.completed = !todo.completed;
       const todo = state.list.find((t) => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
      localStorage.setItem("todos", JSON.stringify(state.list)); // ✅ save
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      // state.list = state.list.filter((t) => t.id !== action.payload);
        state.list = state.list.filter((t) => t.id !== action.payload);
      localStorage.setItem("todos", JSON.stringify(state.list)); // ✅ save
    },
    editTodo: (state, action: PayloadAction<{ id: string; text: string }>) => {
      // const todo = state.list.find((t) => t.id == action.payload.id);
      // if (todo) todo.text = action.payload.text;
       const todo = state.list.find((t) => t.id === action.payload.id);
      if (todo) todo.text = action.payload.text;
      localStorage.setItem("todos", JSON.stringify(state.list)); // ✅ save
    },
    setFilter: (state, action: PayloadAction<Filter>) => {
      state.filter = action.payload;
    },
  },
});

export const { addTodo, toggleTodo, deleteTodo, editTodo, setFilter } =
  todoSlice.actions;
export default todoSlice.reducer;
