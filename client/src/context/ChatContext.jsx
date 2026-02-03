import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext()

export const ChatProvider = ({ children }) => {

    const [messages, setMessages] = useState([])
    const [users,setUsers] = useState([])
    const [selectedUser,setSelectedUser] = useState(null)
    const [unseenMessages,setUnseenMessages] = useState({})

    const {socket, authUser, axios} = useContext(AuthContext)
    const getUsers = async ()=>{
        try{
            const {data} = await axios.get("/api/messages/users")
            if(data.success){
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
            }
        }
        catch(error){
            toast.error(error.message)
        }
    }

    const getMessages = async (userId) => {
        try{
            const {data} = await axios.get(`/api/messages/${userId}`)
            if(data.success){
                setMessages(data.messages)
            }
        }
        catch(error){
            toast.error(error.message)
        }
    }

    const sendMessages = async(message) => {
        try{
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, {message})
            if(data.success){
               setMessages((prev) => [...prev, data.message])
            }
            else{
                toast.error(data.message)
            }
        }
        catch(error){
            toast.error(error.message)
        }
    }

    const subscribeToMessages = () => {
        if(!socket) return
        socket.on("message", (newMessage) => {
            console.log("Received message:", newMessage)
            console.log("Selected user:", selectedUser)
            
            // If the message is from the currently selected user, add it to messages
            if(selectedUser && (newMessage.sender._id === selectedUser._id || newMessage.receiverId === selectedUser._id)) {           
                setMessages((prev) => [...prev, newMessage])
                console.log("Added to messages")
            }
            // If the message is not from the selected user, increment unseen count
            else if(newMessage.sender._id !== authUser._id) {
                setUnseenMessages((prev) => ({
                    ...prev,
                    [newMessage.sender._id]: prev[newMessage.sender._id] ? prev[newMessage.sender._id] + 1 : 1
                }))
                console.log("Incremented unseen count")
            }
        })
    }

    const unsubscribeFromMessages = () => {
        if(!socket) return
        socket.off("message")
    }

    useEffect(() => {
       subscribeToMessages()
       return () => {
        unsubscribeFromMessages()
       }
    }, [socket, selectedUser])

    const value={
        messages,
        setMessages,
        users,
        setUsers,
        selectedUser,
        setSelectedUser,
        getUsers,
        getMessages,
        sendMessages,
        unseenMessages,
        setUnseenMessages
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}