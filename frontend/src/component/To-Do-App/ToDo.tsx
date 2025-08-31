import { useState,useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../src/store";
import { MdDelete ,MdEdit,MdSave} from "react-icons/md";
// import { useFormContext } from "../formContext";
import {
  addTodo,
  toggleTodo,
  deleteTodo,
  editTodo,
  setFilter,
} from "./todoSlice";
type User = {
  id: number;
  name: string;
  email: string;
};

export default function TodoApp() {
  const todos = useSelector((state: RootState) => state.todos.list);
  const filter = useSelector((state: RootState) => state.todos.filter);
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  //  const { formData, setFormData } = useFormContext();
    const [user, setUser] = useState<User | null>(null);
  
  // User Fetching 
   useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token"); // get token
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`, // attach token
          },
        });
        console.log("res of user is :",res);

        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  const filteredTodos = todos.filter((todo) =>
    filter === "all"
      ? true
      : filter === "completed"
      ? todo.completed
      : !todo.completed
  );

  const handleAdd = () => {
    if (text.trim()) {
      dispatch(addTodo(text));
      setText("");
    }
  };

  const handleEditSave = (id: string) => {
    if (editText.trim()) {
      dispatch(editTodo({ id, text: editText }));
      setEditId(null);
      setEditText("");
    }
  };
  function handleSignout() {
    window.location.href = "/SignIn";
  }

  return (
    <div className="sm:w-[375px] sm:h-[812] md:w-[768px] lg:w-[1440px] xl:w-[1920px] 2xl:w-[2560px]">
      <div className="sm:w-[375px] sm:h-full ">
        {/* logo-dashborad-signout */}
        <div className="flex w-[375px] h-32px items-center justify-center ">
          <div className="absolute w-[47px] h-[32px] top-[55px] left-[16px] rotate-0 opacity-100 flex gap-[10px]">
            <img
              src="/icon.png"
              alt="Right"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="absolute w-[129px] h-[22px] top-[60px] left-[70px] rotate-0 opacity-100">
            DashBoard
          </div>

          <div className="absolute w-[75px] h-[21px] top-[60px] left-[284px] rotate-0 opacity-100">
            <button className="text-blue-400" onClick={handleSignout}>
              SignOut
            </button>
          </div>
        </div>

        {/* welcome user */}
        <div className="absolute w-[343px] h-[130px] top-[128px] left-[16px] rotate-0 opacity-100 rounded-[10px] border-[1px] p-[16px] flex flex-col gap-[10px]">
          <p>Welcome, {user ? user.name : "Guest"}</p>
          <p>Email: {user ? user.email : "Not available"}</p>
        </div>
      
       
        {/* Create Note */}
           <div className="absolute w-full h-[52px] top-[283px] p-4 rotate-0 opacity-100 flex items-center gap-[20px]">
           <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 border rounded px-3 py-1"
            placeholder="Add a new task"
          />
        </div>
        <div className="absolute w-full h-[52px] top-[335px] p-4 rotate-0 opacity-100 flex items-center gap-[20px]">
         
          <button
            onClick={handleAdd}
            className="bg-blue-500 text-white px-4 py-1 rounded"
          >
            Create Note
          </button>
        </div>

        <div className="flex gap-2 mb-4 absolute w-full h-[52px] top-[387px] p-4 rotate-0 opacity-100 items-center">
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => dispatch(setFilter(f as any))}
              className={`px-3 py-1 rounded ${
                filter === f ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <ul className="absolute w-[343px] h-[50px] top-[439px] left-[16px]">
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className=" items-center justify-between py-2 mt-2 rotate-0 opacity-100 rounded-[10px] border-[1px] p-[16px] flex  gap-[10px]"
            >
              {editId === todo.id ? (
                <>
                {/* edit option */}
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1  px-2 py-1 rounded outline-none focus:ring-0"
                  />
                  <button
                    onClick={() => handleEditSave(todo.id)}
                    className="ml-2 text-green-600 "
                  >
                     <MdSave size={20} />
                  </button>
                </>
              ) : (
                <>
                  <span
                    onClick={() => dispatch(toggleTodo(todo.id))}
                    className={`flex-1 cursor-pointer ${
                      todo.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {todo.text}
                  </span>
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => {
                        setEditId(todo.id);
                        setEditText(todo.text);
                      }}
                      className="text-yellow-600"
                    >
                       <MdEdit size={20} />
                    </button>
                    <button
                      onClick={() => dispatch(deleteTodo(todo.id))}
                      className="text-red-600"
                    >
                      <MdDelete size={20} className="text-black" />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
