import { createContext, useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import io from "socket.io-client";

export const AuthContext = createContext();

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    // Check if user is authenticated and if so then set then user data and conect the socket

    const checkAuth = async () => {
        if (token) {
            try {
                const response = await axios.get("/api/auth/check");
                setAuthUser(response.data.user);
                connectSocket(response.data.user);
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    // Login function to handle user authentication and socket connection

    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials);
            if (data.success) {
                setToken(data.token);
                setAuthUser(data.user);
                connectSocket(data.user);
                axios.defaults.headers.common['token'] = data.token;
                localStorage.setItem("token", data.token);
                toast.success(data.message);
            }
            else {
                toast.error(data.message);
            }
        }
        catch (error) {
            toast.error(error.message);
        }
    }


    const logout = async () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common['token'] = null;
        socket.disconnect()
    }

    const updateProfile = async (body) => {
        try {
            const {data} = await axios.put("/api/auth/update-profile", body)
            if(data.success) {
                setAuthUser(data.user)
                connectSocket(data.user)
                axios.defaults.headers.common['token'] = data.token;
                setToken(data.token)
                localStorage.setItem("token", data.token)
                toast.success(data.message)
            }
            else{
                toast.error(data.message)
            }
        }
        catch (err) {
            toast.error(err.message);
        }
    }
    const connectSocket = (userData) => {
        if (!userData || socket?.connected) return;
        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id
            }
        });
        newSocket.connect()
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (users) => {
            setOnlineUsers(users);
        });
    }

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['token'] = token;
        }
        checkAuth()
    }, [token]);

    const value = {
        axios,
        token,
        setToken,
        authUser,
        setAuthUser,
        login,
        logout,
        updateProfile,
        onlineUsers,
        setOnlineUsers
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}