import { Server as SocketIOServer } from "socket.io";
import type { Server as HttpServer } from "http";
import { collection, addDoc, query, orderBy, limit, getDocs, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "./firebase.js";
import { logger } from "./logger.js";

export interface ChatMessage {
  id: string; roomId: string; senderId: string; senderName: string; content: string; timestamp: number;
}

export function createSocketServer(httpServer: HttpServer) {
  const io = new SocketIOServer(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
    path: "/api/socket.io",
    transports: ["polling", "websocket"],
  });

  io.on("connection", (socket) => {
    logger.info({ socketId: socket.id }, "Socket client connected");

    socket.on("join_room", (roomId: string) => { socket.join(roomId); });
    socket.on("leave_room", (roomId: string) => { socket.leave(roomId); });

    socket.on("send_message", async (data: { roomId: string; senderId: string; senderName: string; content: string }) => {
      try {
        const docRef = await addDoc(collection(db, "rooms", data.roomId, "messages"), {
          senderId: data.senderId, senderName: data.senderName, content: data.content, timestamp: serverTimestamp(),
        });
        const message: ChatMessage = { id: docRef.id, roomId: data.roomId, senderId: data.senderId, senderName: data.senderName, content: data.content, timestamp: Date.now() };
        io.to(data.roomId).emit("message", message);
      } catch (err) { logger.error({ err }, "Error saving message"); socket.emit("error", { message: "Failed to send message" }); }
    });

    socket.on("get_history", async (roomId: string) => {
      try {
        const q = query(collection(db, "rooms", roomId, "messages"), orderBy("timestamp", "asc"), limit(50));
        const snapshot = await getDocs(q);
        const messages: ChatMessage[] = snapshot.docs.map((doc) => {
          const d = doc.data();
          return { id: doc.id, roomId, senderId: d["senderId"], senderName: d["senderName"], content: d["content"], timestamp: d["timestamp"] instanceof Timestamp ? d["timestamp"].toMillis() : Date.now() };
        });
        socket.emit("history", { roomId, messages });
      } catch (err) { logger.error({ err, roomId }, "Error fetching history"); socket.emit("history", { roomId, messages: [] }); }
    });

    socket.on("disconnect", () => { logger.info({ socketId: socket.id }, "Socket client disconnected"); });
  });

  return io;
}
