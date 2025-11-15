import React, { useEffect, useState, useRef } from "react";
// Changed import path from alias to relative
import { auth, db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc, // Combined imports
  setDoc, // Combined imports
} from "firebase/firestore";

// Removed UserProfile interface

export const Messenger = ({
  otherUser,
  onClose,
}) => {
  // Removed type annotations
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  const currentUid = auth.currentUser?.uid;
  if (!currentUid) return <div>Please sign in to message.</div>;

  // deterministic chat id for 1:1 chat
  const chatId = [currentUid, otherUser.uid].sort().join("_");

  useEffect(() => {
    const msgsCol = collection(db, "chats", chatId, "messages");
    const q = query(msgsCol, orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const list = []; // Removed type annotation
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      setMessages(list);
      // scroll to bottom
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    });

    return () => unsub();
  }, [chatId]);

  const handleSend = async () => {
    if (!text.trim()) return;
    const msgsCol = collection(db, "chats", chatId, "messages");
    await addDoc(msgsCol, {
      from: currentUid,
      text: text.trim(),
      createdAt: serverTimestamp(),
    });
    // upsert conversation summary with last message
    try {
      await setDoc(doc(db, "conversations", chatId), {
        chatId,
        participants: [currentUid, otherUser.uid],
        lastMessage: text.trim(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (e) {
      console.error('Failed to update conversation summary', e);
    }
    setText("");
  };

  return (
    <div className="fixed right-6 bottom-6 w-[380px] max-h-[70vh] bg-white border rounded-lg shadow-lg flex flex-col overflow-hidden z-50">
      <div className="px-4 py-2 border-b flex items-center justify-between">
        <div>
          <div className="font-bold">{otherUser.name}</div>
          <div className="text-xs text-muted-foreground">{otherUser.university}</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-sm text-muted-foreground" onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      <div className="px-4 py-3 flex-1 overflow-y-auto space-y-3 bg-slate-50">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[80%] p-2 rounded-lg ${m.from === currentUid ? "ml-auto bg-primary text-primary-foreground" : "mr-auto bg-white border"}`}
          >
            <div className="text-sm">{m.text}</div>
            <div className="text-xs text-muted-foreground mt-1">{new Date(m.createdAt?.toDate ? m.createdAt.toDate() : Date.now()).toLocaleTimeString()}</div>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      <div className="p-3 border-t">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 rounded-md border px-3 py-2"
            placeholder="Write a message..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          <button
            onClick={handleSend}
            className="px-3 py-2 rounded bg-primary text-primary-foreground"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messenger;