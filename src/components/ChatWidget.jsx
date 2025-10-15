import { useEffect, useRef, useState } from "react";
import { askChatbot } from "../api/chatbot";
import { FiMessageSquare, FiSend, FiX } from "react-icons/fi";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "greet",
      role: "bot",
      text:
        "Hi! I’m TechNova Assistant.\n• Try: “find gaming laptop”\n• “order OD-002”\n• “delivery OD-002”",
    },
  ]);

  const listRef = useRef(null);
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  const send = async (q) => {
    const query = (q ?? input).trim();
    if (!query) return;
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", text: query }]);
    setInput("");
    setBusy(true);
    try {
      const res = await askChatbot(query);
      const answer = res.data?.answer || "Sorry, I don’t have an answer.";
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "bot", text: answer }]);
    } catch {
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "bot", text: "Oops, something went wrong. Try again." },
      ]);
    } finally {
      setBusy(false);
    }
  };

  const Quick = ({ label, q }) => (
    <button
      onClick={() => send(q)}
      className="text-xs px-2 py-1 rounded-lg border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] transition"
    >
      {label}
    </button>
  );

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#3B82F6] text-white grid place-items-center hover:bg-[#2563EB] transition"
        aria-label="Open chat"
        title="Chat with TechNova"
      >
        <FiMessageSquare size={22} />
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[92vw] rounded-xl overflow-hidden bg-white border border-[#BFDBFE] shadow-sm">
          {/* Header */}
          <div className="h-12 px-4 flex items-center justify-between border-b border-[#BFDBFE] bg-[#DBEAFE]">
            <div className="text-sm font-semibold text-[#1E40AF]">🤖 TechNova Assistant</div>
            <button
              onClick={() => setOpen(false)}
              className="text-[#1E40AF] hover:opacity-80"
              aria-label="Close"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Messages */}
          <div ref={listRef} className="h-80 overflow-y-auto p-3 space-y-3 bg-white">
            {messages.map((m) => (
              <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex"}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[80%] rounded-xl px-3 py-2 bg-[#3B82F6] text-white"
                      : "max-w-[80%] rounded-xl px-3 py-2 bg-[#EFF6FF] text-[#1E3A8A] whitespace-pre-wrap"
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}
            {busy && <div className="text-xs text-[#1E40AF]">Thinking…</div>}
          </div>

          {/* Quick actions */}
          <div className="px-3 py-2 flex flex-wrap gap-2 border-t border-[#BFDBFE] bg-white">
            <Quick label="Find a laptop" q="find gaming laptop" />
            <Quick label="Order status" q="order OD-001" />
            <Quick label="Delivery status" q="delivery OD-001" />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="p-3 flex items-center gap-2 bg-white border-t border-[#BFDBFE]"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 bg-white border border-[#BFDBFE] rounded-lg px-3 py-2 text-[#1E3A8A] outline-none focus:ring-2 focus:ring-[#3B82F6]/40"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="px-3 py-2 rounded-lg bg-[#3B82F6] text-white hover:bg-[#2563EB] disabled:opacity-40 transition inline-flex items-center gap-2"
            >
              <FiSend /> Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
