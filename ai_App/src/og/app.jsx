import { useEffect, useRef, useState } from 'react'
import ai from './gemini'
import Answer from './components/answer'
import Loader from './components/Loader'



function App() {
  const [question, setquestion] = useState('')
  const [result, setresult] = useState([])
  const [History, setHistory] = useState(JSON.parse(localStorage.getItem('history')) || [])
  const [selectedHistory, setSelectedHistory] = useState('')
  const [loader, setLoader] = useState(false)
  const scrolltoans = useRef()
  const [darkmode, setdarkmode] = useState('dark')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const clearHistory = () => {
    localStorage.removeItem('history')
    setHistory([])
    setSelectedHistory('')
    setresult([])
  }
  //Chatgpt:- when  api key reaches its lomit it will show error:
  const showError = error => {
    console.error(error)
    if (!navigator.onLine) alert('No internet connection. Please check your internet.')
    else alert('Failed to fetch AI response. Please try again.')
  }
  // Main chatting.
  const askQuestion = async () => {
    if (!question.trim()) return
    try {
      setLoader(true)
      //Wait till  ans. from api comes 
      const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: question })
      let datastring = response.text
      // makeing response clear from (**,***,# from ai response)
      datastring = datastring.split('*')
      datastring = datastring.map(item => item.trim()).filter(Boolean)
     
      // Setting response.
      setresult(prev => [...prev, { type: 'q', text: question }, { type: 'a', text: datastring }])
      // Again clearing ask box for nxt question.
      setquestion('')
      setSelectedHistory('')
      //Directly scrolls to latest response(where *scrolltoans* is used ) in 250 ms.
      setTimeout(() => {
        if (scrolltoans.current) scrolltoans.current.scrollTop = scrolltoans.current.scrollHeight
      }, 250)
    } /*if there's error other than API then catch will run.*/catch (error) {
      showError(error)
    } /*once try/catch ends their execution then loader is closed.*/finally {
      setLoader(false)
    }
  }
  // Connecting chats to backend  using localhost/api/chats :
  const fetchUser = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/chats/fetchallchats", {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("auth-token")
        }
      });

      const chats = await response.json();

      if (response.ok) {
        setHistory(chats);
      }
      else {
        console.error(chats);
      }

    } catch (error) {
      console.error("fetching chats Error : ", error)
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  // connecting history to messages loading using localhost/api/message/_id. :
  const fetchmsg = async (chatId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/message/${chatId}`, {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("auth-token")
        }
      });

      const messages = await response.json();

      if (response.ok) {
        console.log("Message : ", messages)
        const formattedMessages = messages.map(message => ({
          type: message.role === "user" ? "q" : "a",
          text: message.role === "user" ? message.content : [message.content]
        })
      )}
      else {
        console.error(messages);
      }
    } catch (error) {
      console.error("fetching chats Error : ", error)
    }
  }
  // only when enter key is pressed after asking question.
  const isEnter = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()//for *shift+enter* it will not work
      askQuestion()//Question is sent to api.
    }
  }
  // New chat.
  const newChat = async() => {
    try {
      const response = await fetch("http://localhost:5000/api/chats/createChats",{
          method:"POST",
          headers:{
            "auth-token":localStorage.getItem("auth-token")
          },
          body:JSON.stringify({})
      })
      const chat = await response.json() 
      if(response.ok){
        setHistory(previous_history=>[chat,...previous_history])
    setSelectedHistory(chat)
    setresult([])
    setquestion('')
      }
      else{
        console.log("Creating chat Failed",chat)
      }
    } catch (error) {
      console.error("fetching chats Error : ", error)
    }
  }
  /**first it checks whether there's selected history(from history clm.)&
    if true returns in chat-area(Result area) that selected history question(q)&ans.(a) 
  useEffect(() => {
    if (!selectedHistory) return
    setresult([{ type: 'q', text: selectedHistory.question }, { type: 'a', text: selectedHistory.Answer }])
  }, [selectedHistory])
  */
  /**checks if dark :if yes then makes html:-dark(.add) || if no then makes html:-light(.remove("dark")) */
  useEffect(() => {
    if (darkmode === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [darkmode])

  return (
    <>

      <div className={darkmode === 'dark' ? 'dark' : 'light'}>
        <div className='grid grid-cols-1 md:grid-cols-5 text-center h-screen p-2 md:p-3 dark:bg-[#1b1b1b] bg-[#d0ced2]'
        /**
         *responsive classes:
         1] grid(initially col-1) if(screen = md:)then col-5(1-sidebar,4-chat)
         2] padding(initially p-2) if(screen = md:)then p-4
         3] mode(initially dark[#1b1b1b])  if(!dark) then bg-light[#d0ced2]
         *ternary opre. used :
         condition(if dark mode) ? exprIfTrue(bg-black) : exprIfFalse(bg-white) 
          initially it is dark;value = {darkmode}
          */
        >

          {/*Dark/Light mode selection.*/}
          {!sidebarOpen && (
            /*checks from sidebar condition for responsiveness.
             if (!sidebar) is true(closed) then run (select-area of D/L mode). */
            <select onChange={e => setdarkmode(e.target.value)} value={darkmode} className='dark:text-red-300 text-zinc-500 font-bold fixed top-2 right-2 p-2 z-30 bg-transparent outline-none'>
              <option value='dark'>Dark</option>
              <option value='light'>Light</option>
            </select>
          )}

          {/* Recent Search tasks&responsiveness. */}
          {sidebarOpen && (
            /*checks from sidebar condition for responsiveness.
             if (sidebar) is true(open) then run Recent Search area. */
            <div className='fixed md:relative z-20  top-2 bottom-2 md:top-0 md:bottom-0 left-2 md:left-0 w-[calc(100%-1rem)] md:w-auto md:col-span-1 dark:bg-[#323231] bg-[#88868b] h-[calc(100vh-1rem)] text-wrap overflow-y-scroll scrollbar-thumb-transparent scroll-smooth scrollbar-thin rounded-2xl'>
              <div className='flex justify-between items-center px-3'>
                {/* header : Recent search. */}
                <h1 className='dark:text-white text-white font-bold text-lg m-auto p-3'>Recent Search</h1>
                {/* Clear History btn.*/}
                <button className='p-2 rounded-lg dark:hover:bg-[#151514] hover:bg-[#747277]' onClick={clearHistory}>
                  <svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='#e3e3e3'><path d='M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z' /></svg>
                </button>
              </div>
              {/* Newchat. */}
              <button onClick={newChat} className='mx-3 mb-3 w-[calc(100%-24px)] p-2 rounded-xl dark:bg-[#292928] bg-[#9e9ca1] dark:hover:bg-[#151514] hover:bg-[#747277] text-white text-center font-semibold'>+  New Chat</button>
              {/* History Getting */}
              <ul className='dark:text-white text-white text-md text-left p-2 overflow-auto'>
                {History.map((item, index) => (
                  /**if there's history present then .map() goes though that array(localStorage.set item : setHistory=newHistory{[q,a]}). */
                  <li onClick={() => {
                    console.log("Clicked chat:", item);
                    console.log("Chat ID:", item._id);
                    setSelectedHistory(item)
                    fetchmsg(item._id)
                    /*from askQuestion():this is where item q-a(history is displayed on chat-area) items are set.*/
                    setSidebarOpen(false)
                  }} key={index} className={`p-2 pl-5 truncate cursor-pointer rounded-lg list-outside list-disc ${selectedHistory === item ? 'dark:bg-[#151514] bg-[#747277]' : 'dark:hover:bg-[#151514] hover:bg-[#747277]'}`}>
                    {/* here the setHistory items are set into list(<li/>).*/}
                    {item.title}
                  </li>
                ))}
              </ul>
            </div>
          )}


          {/* Chat-Sidebar. 
        if open(true) then (1:sidebar;4:chat) if close(false) then (5:chat) 
        for responsive classes it is col-1.(as mention in starting).
         */}
          <div className={sidebarOpen ? 'col-span-1 md:col-span-4 p-2 md:p-3' : 'col-span-1 md:col-span-5 p-2 md:p-3'}>
            {/* sidebar btn & functioning */}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className='fixed top-6 left-6 z-40 px-3 py-2 rounded-lg dark:bg-[#323231] bg-[#88868b] dark:text-white text-white shadow-md'>
              ☰
            </button>

            {/* chatbox. */}
            {result.length === 0 ? (
              /**if result is true(no response) then show header & question-box */
              <div className='h-full flex flex-col items-center justify-center'>
                {/* Header */}
                <h1 className='text-3xl md:text-5xl p-2 bg-clip-text text-transparent bg-gradient-to-r dark:from-[#315b8a] dark:via-[#4289c7] dark:to-[#5aaee8] from-[#7c3aed] via-[#c026d3] to-[#f97316] mb-6 md:mb-15'>
                  Hello, Ask Anything
                </h1>
                {/* Question-box ; Loader.jsx : from uiverseio.com */}
                <div className='dark:bg-[#323231] bg-[#9e9ca1] dark:hover:bg-zinc-800 hover:bg-[#aaa8ad] w-[95%] bottom-0.5 md:bottom-2 md:w-1/2 p-1 pr-3 md:pr-5 my-3 dark:text-white text-black h-20 rounded-4xl border-2 dark:border-[#8f8f8f] border-[#777579] flex'>
                  <textarea placeholder='Ask Anything' value={question} onChange={e => setquestion(e.target.value)} onKeyDown={isEnter} className='ml-3 p-3 outline-none w-full h-full text-wrap scrollbar-thin scrollbar-thumb-transparent bg-transparent resize-none' />
                  <button className='relative bg-[#2f2f2e] rounded-4xl text-white w-20 md:w-1/5 text-[15px] font-bold' onClick={askQuestion} disabled={loader}>
                    {loader ? <div className='scale-[0.5]'><Loader /></div> : 'Ask'}
                  </button>
                </div>
              </div>
            ) : (/*Else: result is false(response present) then show followings:
              1]Loader("..."[animated])
              2]Response (question-display:if item.type = q,answer-display:if item.type = a)
              3]Question-box
              */
              <>
                {/* Loader (gpt + another web.) */}
                {loader && (/**if loader is true ('...') this will be animated else disabled(as line 149)*/
                  <div className='flex flex-row gap-2 justify-center p-3'>
                    <div className='w-4 h-4 rounded-full bg-gray-400 animate-bounce [animation-delay:.3s]'></div>
                    <div className='w-4 h-4 rounded-full bg-gray-500 animate-bounce [animation-delay:.6s]'></div>
                    <div className='w-4 h-4 rounded-full bg-gray-400 animate-bounce [animation-delay:.2s]'></div>
                  </div>
                )}
                {/* response. */}
                <div /**here ""scrolltoans""  is used*/ ref={scrolltoans} className='scroll-smooth container mt-3 h-[calc(100vh-190px)] md:h-135 overflow-y-scroll scrollbar-thumb-transparent scrollbar-thin'>
                  {/* Q-A presentation in chatbox logic& response simplification */}
                  <div className='dark:text-white text-black'>
                    <ul>
                      {result.map((item, index) => (/** .map(): will go through array checking each item */
                        <div key={index} className={item.type === 'q' ? 'flex justify-end' : ''}>
                          {item.type === 'q' ? (
                            <li className='max-w-[90%] md:max-w-[70%] text-right text-[16px] p-2 dark:border-5 border-2 dark:border-[#2f2f2f] border-[#989898] rounded-bl-lg rounded-3xl dark:bg-[#131414] bg-[#b8b6ba] mt-3 mb-4'>
                              <Answer ans={item.text} totalresult={1} index={index} />
                            </li>
                          ) : (
                            item.text.map((ansItem, ansIndex) => (
                              <li key={ansIndex} className='text-left text-[16px] md:text-[18px] font-serif'>
                                <Answer ans={ansItem} totalresult={item.text.length} index={ansIndex} />
                              </li>
                            ))
                          )}
                        </div>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Question-box ; Loader.jsx : from uiverseio.com*/}
                <div className='dark:bg-[#323231] bg-[#9e9ca1] dark:hover:bg-zinc-800 hover:bg-[#aaa8ad] w-[95%] bottom-0.5 md:bottom-2 md:w-1/2 p-2 pr-3 md:pr-5 mb-7 mt-8 md:mt-10 md:mb-7  dark:text-white text-black m-auto h-20 rounded-4xl text-center border-2 dark:border-[#8f8f8f] border-[#777579] flex'>
                  <textarea placeholder='Ask Anything' value={question} onChange={e => setquestion(e.target.value)} onKeyDown={isEnter} className='ml-3 p-3 outline-none w-full h-full text-wrap scrollbar-thin scrollbar-thumb-transparent bg-transparent resize-none' />
                  <button className=' relative bg-[#2f2f2e] rounded-4xl text-white w-20 md:w-1/5 text-[15px] font-bold' onClick={askQuestion} disabled={loader}>
                    {loader ? <div className='scale-[0.5]'><Loader /></div> : 'Ask'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default App