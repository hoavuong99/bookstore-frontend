/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { useForm } from "react-hook-form"

import axios from "axios"
import getBaseUrl from '../utils/baseURL'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
    const [message, setMessage] = useState("")
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm()

      const navigate = useNavigate()

      const onSubmit = async (data) => {
        try {
           const response =  await axios.post(`${getBaseUrl()}/api/auth/admin`, data, {
                headers: {
                    'Content-Type': 'application/json',
                }
           })
           const auth = response.data;
            if(auth.token) {
                localStorage.setItem('token', auth.token);
                setTimeout(() => {
                    localStorage.removeItem('token')
                    alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                    navigate("/")
                }, 3600 * 1000)
            }

            navigate("/dashboard")

        } catch (error) {
            setMessage("Vui lòng nhập email và mật khẩu hợp lệ.")
            console.error(error)
        }
      }
  return (
    <div className='h-screen flex justify-center items-center '>
        <div className='w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
            <h2 className='text-xl font-semibold mb-4'>Đăng nhập quản trị</h2>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="username">Tên đăng nhập</label>
                    <input 
                    {...register("username", { required: true })} 
                    type="text" name="username" id="username" placeholder='Tên đăng nhập'
                    className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow'
                    />
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="password">Mật khẩu</label>
                    <input 
                    {...register("password", { required: true })} 
                    type="password" name="password" id="password" placeholder='Mật khẩu'
                    className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow'
                    />
                </div>
                {
                    message && <p className='text-red-500 text-xs italic mb-3'>{message}</p>
                }
                <div className='w-full'>
                    <button className='bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none'>Đăng nhập</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default AdminLogin