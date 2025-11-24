import React, { useState, useEffect, useRef } from 'react'
import { Bot, Globe, Paperclip, ArrowUp } from "lucide-react"
import logo from "../../public/logo.png"
import axios from "axios"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow as codeTheme } from "react-syntax-highlighter/dist/esm/styles/prism";

const Prompt = () => {
  const [inputValue, setInputValue] = useState("");
  const [typedMessage, setTypedMessage] = useState("");
  const [prompt, setPrompt] = useState([])
  const [loading, setLoading] = useState(false)
  console.log(prompt)

  //gettign the prompt from from localstorage to disply on screen
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    const storedPrompt = localStorage.getItem(`promptHistory_${user._id}`);
    if (storedPrompt) {
      setPrompt(JSON.parse(storedPrompt))
    }
  }, [])

  //setting the prompt to localstorage and then render on screen
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    localStorage.setItem(`promptHistory_${user._id}`, JSON.stringify(prompt));
  }, [prompt]);


  const promptEndRef = useRef();
  //useeffect for scroll to end after assistant reply
  useEffect(() => {
    promptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [prompt, loading])


  const handleSend = async (e) => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setTypedMessage(trimmed);
    setInputValue("")
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/deepseekai/prompt`,
        { content: trimmed }, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      })
      setPrompt((prev) => [
        ...prev,
        { role: "user", content: trimmed },
        { role: "assistant", content: data.reply }
      ])
    } catch (error) {
      // console.log(error)
      setPrompt((prev) => [
        ...prev,
        { role: "user", content: trimmed },
        { role: "assistant", content: "Something went wrong with the AI response." }
      ])
    }
    finally {
      setLoading(false)
      setTypedMessage(null)
    }
  }
  const handleKeyDown = (e) => {
    console.log(e)
    if (e.key === 'Enter') {
      handleSend();
    }
  }


  return (
    <div className='flex flex-col items-center justify-between flex-1 w-full px-4 pb-4'>
      {/*Greeting  */}
      <div className='mt-5 text-center md:mt-16'>
        <div className='flex items-center justify-center gap-2'>
          <img src={logo} alt="DeepSeek Logo" className='h-8' />
          <h1 className='font-semibold text-3xl text-white mb-2'>Hi, I'm AI Friend</h1>
        </div>
        <p className='text-gray-400 text-base mt-2'>How can I help you Today</p>
      </div>

      {/* Prompt */}
      <div className='w-full max-w-4xl flex-1 overflow-y-auto mt-6 mb-4 space-y-4 max-h-[50vh] px-1'>
        {/* {typedMessage && (
          <div className='w-full flex justify-end'>
            <div className='self-end bg-blue-700 text-white px-4 py-2 max-w-[75%] rounded-xl'>{typedMessage}</div>
          </div>
        )} */}
        {prompt.map((msg, index) => (
          <div key={index} className={`w-full flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" ? (
              <div className="w-full bg-[#232323] text-white rounded-xl px-4 py-3 text-sm whitespace-pre-wrap">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={codeTheme}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-lg mt-2"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code
                          className="bg-gray-800 px-1 py-0.5 rounded"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="w-[30%] bg-blue-700 text-white rounded-xl px-4 py-2 text-sm">{msg.content}</div>
            )}
          </div>
        ))}
        {loading && typedMessage && (
          <div className='w-full flex justify-end'>
            <div className='w-[50%] bg-blue-700 text-white rounded-xl px-4 py-2 text-sm'>{typedMessage}</div>
          </div>
        )}
        {loading && (
          <div className='w-full flex justify-start'>
            <div className='bg-[#232323] text-white px-4 py-2 rounded-xl text-sm animate-pulse'>Loading...</div>
          </div>
        )}
        <div ref={promptEndRef} />
      </div>

      {/*input box  */}
      <div className='w-full max-w-4xl relative mt-auto'>
        <div className='bg-[#2f2f2f] rounded-[2rem] px-6 py-8 shadow-md'>
          <input
            type="text"
            placeholder='Message DeepSeek'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className='bg-transparent w-full text-white placeholder-gray-400 text-lg outline-none'
          />
          <div className='flex items-center justify-between mt-4 gap-4'>

            <div className='flex items-center gap-2'>
              <button className='flex items-center gap-2 border border-gray-500 text-white text-base px-3 py-1.5 rounded-full hover:bg-gray-600 transition'>
                <Bot className='w-4 h-4' />DeepThink (R1)
              </button>
              <button className='flex items-center gap-2 border border-gray-500 text-white text-base px-3 py-1.5 rounded-full hover:bg-gray-600 transition'>
                <Globe className='w-4 h-4' />
                Search
              </button>
            </div>

            <div className='flex items-center gap-2'>
              <button className='text-gray-400 hover:text-white transition'>
                <Paperclip className='w-5 h-5' />
              </button>
              <button onClick={handleSend} className='bg-gray-500 hover:bg-blue-900 p-2 rounded-full text-white transition'>
                <ArrowUp className='w-4 h-4' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Prompt