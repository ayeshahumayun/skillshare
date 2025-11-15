import React, { useEffect, useState, useRef } from "react";
import { auth, db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";

// Removed UserProfile interface

// Removed React.FC and type annotations from props
const InlineChat = ({ otherUser, onClose }) => {
  const [messages, setMessages] = useState([]); // Removed <any[]>
  const [text, setText] = useState("");
  const bottomRef = useRef(null); // Removed <HTMLDivElement | null>

  const currentUid = auth.currentUser?.uid;
  if (!currentUid) return <div className="p-6">Sign in to chat</div>;

  const chatId = [currentUid, otherUser.uid].sort().join("_");

  useEffect(() => {
    const msgsCol = collection(db, "chats", chatId, "messages");
    const q = query(msgsCol, orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const list = []; // Removed <any[]>
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      setMessages(list);
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
    try {
      await setDoc(doc(db, "conversations", chatId), {
        chatId,
        participants: [currentUid, otherUser.uid],
        lastMessage: text.trim(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (e) {
      console.error(e);
    }
    setText("");
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-white">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <div>
          <div className="font-semibold">{otherUser.name}</div>
          <div className="text-xs text-muted-foreground">{otherUser.university}</div>
        </div>
        <div>
          {onClose ? (
            <button className="px-2 py-1 text-sm" onClick={onClose}>Close</button>
          ) : null}
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto bg-slate-50">
        {messages.map((m) => (
          <div key={m.id} className={`max-w-[70%] p-2 rounded-md ${m.from === currentUid ? "ml-auto bg-primary text-primary-foreground" : "mr-auto bg-white border"}`}>
            <div className="text-sm">{m.text}</div>
            <div className="text-xs text-muted-foreground mt-1">{new Date(m.createdAt?.toDate ? m.createdAt.toDate() : Date.now()).toLocaleTimeString()}</div>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      <div className="p-3 border-t bg-white">
        <div className="flex gap-2">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a message..." className="flex-1 rounded-md border px-3 py-2" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } }} />
          <button onClick={handleSend} className="px-3 py-2 rounded bg-primary text-primary-foreground">Send</button>
        </div>
      </div>
    </div>
  );
};

export default InlineChat;