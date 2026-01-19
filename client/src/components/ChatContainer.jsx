import profileMartin from "../assets/profile_martin.png"
import help_icon from "../assets/help_icon.png"
import logo_icon from "../assets/logo_icon.svg"
import arrow_icon from "../assets/arrow_icon.png"
import avatar_icon from "../assets/avatar_icon.png"
import gallery_icon from "../assets/gallery_icon.svg"
import assets, { messagesDummyData } from "../assets/assets"
import { useEffect, useRef } from "react"
import { formatMessageTime } from "../lib/utils"

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
    const scrollEnd = useRef()

    useEffect(() => {
        if (scrollEnd.current) {
            scrollEnd.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [])

    return selectedUser ? (
        <div className="relative h-full flex flex-col">

            {/* Header */}
            <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
                <img src={profileMartin} alt="" className="w-8 rounded-full" />
                <p className="flex-1 text-lg text-white flex items-center gap-2">
                    Rohan Sharma
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                </p>
                <img onClick={() => setSelectedUser(null)} src={arrow_icon} alt="" className="md:hidden max-w-7" />
                <img src={help_icon} alt="" className="max-md:hidden max-w-5" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 pb-20">
                {messagesDummyData.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex items-end gap-2 mb-4 ${msg.senderId === '680f5116f10f3cd28382ed02'
                                ? 'justify-end'
                                : 'justify-start'
                            }`}
                    >
                        {msg.image ? (
                            <img
                                src={assets?.image}
                                alt=""
                                className="max-w-[230px] border border-gray-700 rounded-lg"
                            />
                        ) : (
                            <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg break-all bg-violet-500/30 text-white ${msg.senderId === '680f5116f10f3cd28382ed02'
                                    ? 'rounded-br-none'
                                    : 'rounded-bl-none'
                                }`}>
                                {msg.text}
                            </p>
                        )}

                        <div className="text-center text-xs">
                            <img
                                src={msg.senderId === '680f5116f10f3cd28382ed02'
                                    ? avatar_icon
                                    : profileMartin}
                                alt=""
                                className="w-7 rounded-full"
                            />
                            <p className="text-gray-500">
                                {formatMessageTime(msg?.createdAt)}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={scrollEnd} />
            </div>

            {/* Send Message Bar */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3 bg-black/40 backdrop-blur">
                <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
                    <input
                        type="text"
                        placeholder="Send a message"
                        className="flex-1 text-sm p-3 bg-transparent outline-none text-white placeholder-gray-400"
                    />
                    <input type="file" id="image" hidden />
                    <label htmlFor="image">
                        <img src={gallery_icon} alt="" className="w-5 mr-2 cursor-pointer" />
                    </label>
                </div>
                <img src={assets.send_button} alt="" className="w-7 cursor-pointer" />
            </div>
        </div>
    ) : (
        <div className="flex flex-col items-center justify-center gap-2 text-gray-500 max-md:hidden">
            <img src={logo_icon} className="w-16" alt="" />
            <p className="text-lg font-medium text-white">
                Chat anytime, anywhere
            </p>
        </div>
    )
}
export default ChatContainer