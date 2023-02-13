import React, { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  query,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import TodoList from "../components/TodoList";
import { AiOutlinePlus } from "react-icons/ai";

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  // Create todo
  const createTodo = async (e) => {
    e.preventDefault(e);
    if (input === "") {
      alert("Please enter a valid todo");
      return;
    }
    await addDoc(collection(db, "todos"), {
      text: input,
      completed: false,
    });
    setInput("");
  };

  // Read todo from firebase
  useEffect(() => {
    const q = query(collection(db, "todos"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let todosArr = [];
      querySnapshot.forEach((doc) => {
        todosArr.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArr);
    });
    return () => unsubscribe();
  }, []);

  // Update todo in firebase
  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, "todos", todo.id), {
      completed: !todo.completed,
    });
  };

  // Delete todo
  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
  };

  return (
    <div className="h-screen w-screen p-4 bg-gradient-to-r from-[#92a8d1] to-[#c5b9cd] py-17">
      <div className="bg-slate-100 max-w-[500px] max-h-[550px] w-full m-auto rounded-md shadow-xl p-6 my-24 overflow-x-scroll scroll-smooth scrollbar-hide">
        <h3 className="text-3xl font-bold text-center text-grey-800 p-2 font-mono">
          Todo List
        </h3>
        <form onSubmit={createTodo} className="flex justify-between">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border p-2 w-full text-xl font-mono"
            type="text"
            placeholder="Add Todo"
          />
          <button className="border p-4 m-2 bg-[#dec2cb]">
            <AiOutlinePlus size={30} />
          </button>
        </form>
        <ul>
          {todos.map((todo) => (
            <TodoList
              key={todo.id}
              todo={todo}
              toggleComplete={toggleComplete}
              deleteTodo={deleteTodo}
            />
          ))}
        </ul>
        {todos.length <= 1 ? null : (
          <p className="text-center p-2 font-mono">{`You have ${todos.length} tasks`}</p>
        )}
      </div>
    </div>
  );
};

export default Home;
