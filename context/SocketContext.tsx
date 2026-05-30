import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType { socket: Socket | null; connected: boolean; }
const SocketContext = createContext<SocketContextType>({ socket: null, connected: false });

const DOMAIN = process.env.EXPO_PUBLIC_DOMAIN ?? "";
const SOCKET_URL = DOMAIN ? `https://${DOMAIN}` : "http://localhost:5000";

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const s = io(SOCKET_URL, { path: "/api/socket.io", transports: ["polling", "websocket"], reconnection: true, reconnectionDelay: 1500, reconnectionAttempts: 10, timeout: 10000 });
    s.on("connect", () => setConnected(true));
    s.on("disconnect", () => setConnected(false));
    s.on("connect_error", () => setConnected(false));
    setSocket(s);
    return () => { s.disconnect(); setSocket(null); setConnected(false); };
  }, []);

  return <SocketContext.Provider value={{ socket, connected }}>{children}</SocketContext.Provider>;
}

export function useSocket() { return useContext(SocketContext); }
