import { useRef, useState } from "react";

export function useToasts() {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const push = (message, type = "info", timeout = 3000) => {
    const id = counter.current++;
    setToasts((t) => [...t, { id, message, type }]);
    if (timeout) {
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), timeout);
    }
  };
  const remove = (id) => setToasts((t) => t.filter((x) => x.id !== id));
  return { toasts, push, remove };
}

