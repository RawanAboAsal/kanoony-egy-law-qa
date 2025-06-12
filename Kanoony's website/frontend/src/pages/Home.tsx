import { useState } from "react";
import { motion } from "framer-motion";
import "./home.css";

type Message = { from: "user" | "bot"; text: string };

export default function Home() {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // لا تقبل السؤال إذا كان أقل من كلمتين
    const words = question.trim().split(/\s/);
    if (words.length < 3) {
      setError("الرجاء إدخال سؤال مكوّن من 3 كلمات على الأقل.");
      return;
    }


    setError(null);
    setIsLoading(true);

    // 1) add user message and placeholder bot message
    setChatHistory((prev) => [
      ...prev,
      { from: "user", text: question },
      { from: "bot",  text: "" },
    ]);
    setQuestion("");

    try {
      const resp = await fetch("http://localhost:4000/legal-advice-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!resp.ok) {
        const body = await resp.text();
        throw new Error(`Status ${resp.status}: ${body}`);
      }

      // 2) stream tokens and append to last bot message
      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value);
          setChatHistory((prev) => {
            const updated = [...prev];
            const last = updated.length - 1;
            updated[last] = {
              ...updated[last],
              text: updated[last].text + chunk,
            };
            return updated;
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-start px-4 py-8"
      dir="rtl"
    >
      {/* Logo + Title */}
      <motion.div
        initial={false}
        animate={{ scale: isLoading ? 0.95 : 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center mb-4"
      >
        <h2 className="text-5xl font-bold text-third">قانوني</h2>
        <img
          src="/src/components/Logo.png"
          alt="Legal Scale"
          className="w-40 h-40 mt-2"
        />
      </motion.div>

      {/* Chat Window */}
        <div className="w-full max-w-3xl mb-4 flex flex-col space-y-3">
        {chatHistory.map((msg, i) => (
           <div
            key={i}
            className={`
              p-4 rounded-xl max-w-3xl
              self-${
                msg.from === "user"
                  ? "end bg-accent text-white"
                  : "start bg-white text-third border border-gray-300"
              }
            `}
          >
            <p className="whitespace-pre-wrap">{msg.text}</p>
            {msg.from === "bot" && msg.text && (
              <button
                className="mt-2 text-sm underline"
                onClick={() => navigator.clipboard.writeText(msg.text)}
                aria-label="نسخ الإجابة"
              >
                نسخ
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Inline Error */}
      {error && <div className="text-red-500 mb-2">{error}</div>}

      {/* Input Field */}
      <form onSubmit={handleSubmit} className="w-full max-w-3xl mt-6">
        <div className="relative">
          <input
            type="text"
            value={question}
            onChange={e => {
              setQuestion(e.target.value);
              if (error) setError(null);
            }}
            placeholder="اكتب سؤالك القانوني..."
            className="w-full bg-primary rounded-full py-6 px-8 pr-14 shadow-lg 
                       focus:outline-none focus:ring-2 focus:ring-accent 
                       text-secondary text-lg"
            disabled={isLoading}
            aria-label="سؤالك القانوني"
          />
          <button
            type="submit"
            disabled={isLoading || question.trim().split(/\s+/).length < 2}
            aria-busy={isLoading}
            aria-label="إرسال السؤال"
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 
                       p-3 rounded-full 
                       ${isLoading 
                         ? "bg-accent opacity-50 cursor-not-allowed" 
                         : "bg-accent hover:bg-primary"}`
            }
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent 
                              rounded-full animate-spin" />
            ) : (
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
