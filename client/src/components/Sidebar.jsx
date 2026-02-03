import logo from "../assets/logo.png"
import menuIcon from "../assets/menu_icon.png"
import searchIcon from "../assets/search_icon.png"
import avatarIcon from "../assets/avatar_icon.png"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { ChatContext } from "../context/ChatContext"
import { useContext, useEffect, useState } from "react"

const Sidebar = () => {
    const { users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages, getUsers } = useContext(ChatContext)
    const { logout, onlineUsers } = useContext(AuthContext)
    const [input, setInput] = useState("")
    const navigate = useNavigate()

    const filteredUsers = input ? users.filter((user) => user.fullName.toLowerCase().includes(input.toLowerCase())) : users

    useEffect(() => {
        getUsers()
    }, [onlineUsers])

    return (

        <div>
            <div className="pb-5 border-b border-stone-500 ">
                <div className="flex justify-between items-center py-2 px-2">
                    <img src={logo} alt="" className="max-w-40" />
                    <div className="relative py-2 group">
                        <img src={menuIcon} alt="Menu" className="max-h-5 cursor-pointer transition-transform hover:scale-110" />
                        <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a2e] border border-[#282142] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            <div className="py-2">
                                <p onClick={() => navigate('/profile')} className="px-4 py-2 text-sm text-white hover:bg-[#282142] cursor-pointer transition-colors flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Edit Profile
                                </p>
                                <hr className="my-2 border-gray-600" />
                                <p className="px-4 py-2 text-sm text-red-400 hover:bg-[#282142] cursor-pointer transition-colors flex items-center gap-2" onClick={() => logout()}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Logout
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
                    <img src={searchIcon} alt="Search" className="w-3" />
                    <input type="text" onChange={(e) => setInput(e.target.value)} value={input} className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1" placeholder="Search User..." />
                </div>
            </div>
            <div className="flex flex-col">
                {filteredUsers?.map((user, index) => (
                    <div onClick={() => { setSelectedUser(user), setUnseenMessages((prev)=>{
                        return {...prev,[user._id]:0}
                    })}} key={index} className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id && 'bg-[#282142]/50'}`}>
                        <img src={user?.profilePic || avatarIcon} className="w-[35px] aspect-[1/1] rounded-full" />
                        <div className="flex flex-col leading-5">
                            <p className="text-amber-600 font-light">{user?.fullName}</p>
                            {
                                onlineUsers?.includes(user._id) ? <span className="text-green-400 text-xs">Online</span> : <span className="text-neutral-400 text-xs">Offline</span>
                            }
                        </div>
                        {
                            unseenMessages[user._id] > 0 && <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">{unseenMessages[user._id]}</p>
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}
export default Sidebar