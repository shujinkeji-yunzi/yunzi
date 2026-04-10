import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = 3000;

  // In-memory state
  const viewers = new Set();
  const messages: any[] = [];

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    viewers.add(socket.id);
    io.emit("viewer_count", viewers.size);

    // Send chat history
    socket.emit("chat_history", messages.slice(-50));

    socket.on("send_message", (data) => {
      const message = {
        id: Date.now().toString(),
        user: data.user || "Anonymous",
        text: data.text,
        timestamp: new Date().toISOString(),
        type: "chat"
      };
      messages.push(message);
      if (messages.length > 100) messages.shift();
      io.emit("new_message", message);
    });

    socket.on("send_gift", (data) => {
      const giftEvent = {
        id: Date.now().toString(),
        user: data.user,
        giftType: data.giftType,
        timestamp: new Date().toISOString(),
        type: "gift"
      };
      io.emit("new_gift", giftEvent);
      
      // Also add to chat
      const chatMsg = {
        ...giftEvent,
        text: `sent a ${data.giftType}!`,
        type: "gift_announcement"
      };
      messages.push(chatMsg);
      io.emit("new_message", chatMsg);
    });

    socket.on("disconnect", () => {
      viewers.delete(socket.id);
      io.emit("viewer_count", viewers.size);
      console.log("User disconnected:", socket.id);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
