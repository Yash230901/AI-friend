import React from 'react'
import { X, LogOut } from "lucide-react"
import Profile from "../../public/profile.avif"
import { useAuth } from '../context/AuthProvider'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user"))
  // console.log(user.firstName + " " + user.lastName)
  const promptHistory = JSON.parse(localStorage.getItem(`promptHistory_${user._id}`))
  console.log(promptHistory)

  const [, setAuthUser] = useAuth()
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/logout`, {
        withCredentials: true
      })
      alert(data.message || "user logout successfully!")
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      setAuthUser(null)
      navigate("/login")
    } catch (error) {
      alert(error?.response?.data?.errors || "Logout failed")
    }
  }

  return (
    <div className='h-full flex flex-col bg-[#232327] justify-between'>
      {/* header */}
      <div className='mb-4 flex items-center justify-between p-4 border-b border-gray-700'>
        <div className='text-2xl font-bold text-gray-200'>AI Friend</div>
        <button>
          <X className='text-gray-300 w-6 h-6' />
          </button>
      </div>
      {/*history  */}
      <div className='px-4 py-3 flex-1 overflow-y-auto space-y-2'>
        <button className='w-full bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl mb-4'>
          + New Chat
        </button>
        <div className='mt-10 text-gray-500 text-sm text-center '>
          {/* No Chat History Yet */}
          {promptHistory?.map((msg, index) => (
            <span key={index}>{msg.role === "user" && (
              <div className=' text-white bg-blue-700 rounded-xl m-3 px-4 py-1'> {msg.content}</div>
            )}</span>
          ))}
        </div>
      </div>
      {/* footer */}
      <div className='p-4 border-t border-gray-700'>
        <div className='flex flex-col gap-3'>
          <div className='flex items-center gap-2 cursor-pointer'>
            <img className='rounded-full w-7 h-7' src={Profile} alt="Profile logo" />
            <span className='text-gray-300'>{user ? user.firstName + " " + user.lastName : "My Profile"}</span>
          </div>
          <button onClick={handleLogout} className='flex items-center gap-2 text-sm text-white px-4 py-2 rounded-lg hover:bg-gray-700 duration-300 transition'>
            <LogOut className='' />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar