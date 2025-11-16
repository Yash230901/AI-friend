import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye } from "lucide-react"
import axios from "axios"
import { useAuth } from '../context/AuthProvider'
const Login = () => {
    console.log(import.meta.env.VITE_BACKEND_URL)
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const [, setAuthUser] = useAuth()
    const handleLogin = async () => {
        setLoading(true)
        setError("")
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/login`, {
                email: formData.email,
                password: formData.password
            }, {
                withCredentials: true
            })
            console.log(data)
            alert(data.message || "Login Succeded")
            localStorage.setItem("user", JSON.stringify(data.user))
            localStorage.setItem("token", data.token)
            setAuthUser(data.token)
            navigate("/")
        } catch (error) {
            const msg = error?.response?.data?.errors || "Login failed"
            console.log(error)
            setError(msg)
        }
        finally {
            setLoading(false)
        }
    }
    const handleChange = (e) => {
        // console.log(e.target.value)
        const value = e.target.value;
        const name = e.target.name;
        setFormData({
            ...formData,
            [name]: value
        })
        //setFormData is taking the previously formvalue by ... and setting input by name with its value
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-black px-4'>
            <div className='bg-[#1e1e1e] text-white w-full max-w-md rounded-2xl p-6 shadow-lg'>
                {/* heading */}
                <h1 className='text-center'>Login</h1>
                {/* email */}
                <div className='mb-4 mt-2'>
                    <input
                        className='w-full bg-transparent border border-gray-600 rounded-md px-4 py-2 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a6ff0] '
                        type="email"
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        placeholder='email' />
                </div>
                {/* password */}
                <div className='mb-4 mt-2 relative'>
                    <input
                        className='w-full bg-transparent border border-gray-600 rounded-md px-4 py-2 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a6ff0] '
                        type="password"
                        name='password'
                        value={formData.password}
                        onChange={handleChange}
                        placeholder='Password' />
                    <span className='absolute right-3 top-3 text-gray-400'>
                        <Eye size={18} />
                    </span>
                </div>
                {/* error messgae */}
                {error && <span className='text-sm text-red-500 mb-4'>{error}</span>}
                {/* terms and condition */}
                <p className='text-xs text-gray-400 mt-4 mb-4'>
                    By signing up, you consent to DeepSeek's Terms of Use  and Privacy Policy.</p>
                {/* signup button */}
                <button
                    disabled={loading}
                    onClick={handleLogin}
                    className='w-full bg-blue-500 rounded-md px-4 py-2 mt-2 hover:bg-blue-700 font-semibold'>
                    {loading ? "loginin.." : "Login"}
                </button>
                {/* links */}
                <div className='flex items-center justify-between mt-2'>
                    <a href="" className='hover:underline text-blue-500'>Haven't Account?</a>
                    <Link to={"/Signup"} className='hover:underline text-blue-500'>Signup</Link>
                </div>
            </div>
        </div>
    )
}

export default Login