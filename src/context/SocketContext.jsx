import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export const SocketDataContext = createContext(null);

const SocketContext = ({ children }) => {
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (socketRef.current) return;

    const socketInstance = io(import.meta.env.VITE_BASE_URL, {
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("✅ Socket Connected:", socketInstance.id);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("❌ Socket Disconnected:", reason);
    });

    socketInstance.on("connect_error", (err) => {
      console.log("⚠️ Socket Error:", err.message);
    });

    return () => {
      console.log("SocketContext cleanup");
      socketInstance.off();
    };
  }, []);

  const sendMessage = useCallback((eventName, data) => {
    if (!socketRef.current?.connected) {
      console.log("Socket not connected");
      return;
    }

    socketRef.current.emit(eventName, data);
  }, []);

  const receiveMessage = useCallback((eventName, callback) => {
    if (!socketRef.current) return;

    socketRef.current.on(eventName, callback);

    return () => {
      socketRef.current.off(eventName, callback);
    };
  }, []);

  return (
    <SocketDataContext.Provider
      value={{
        socket,
        sendMessage,
        receiveMessage,
      }}
    >
      {children}
    </SocketDataContext.Provider>
  );
};

export default SocketContext;