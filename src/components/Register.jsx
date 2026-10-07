/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Link,  useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import { useAuth } from '../context/AuthContext';
import { showErrorToast, showSuccessToast } from '../utils/toast';

const Register = () => {
    const [message, setMessage] = useState("");
    const {registerUser} = useAuth();
    const navigate = useNavigate();

    // console.log(registerUser)
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm()

    //   register user

      const onSubmit = async(data) => {
        try {
            await registerUser({
                email: data.email,
                password: data.password,
                fullName: data.fullName,
                phone: data.phone,
                address: data.address,
            });
            showSuccessToast("User registered successfully.");
            navigate("/")
        } catch (error) {
           const errorMessage = error?.response?.data?.message || error?.message || "Vui lòng nhập thông tin hợp lệ.";
           setMessage(errorMessage);
           showErrorToast(errorMessage);
           console.error(error)
        }
      }
  return (
    <div className='md:h-[calc(100vh-120px)] h-full flex justify-center items-center '>
    <div className='w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
        <h2 className='text-xl font-semibold mb-4 text-center'>Đăng ký tài khoản</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="fullName">Họ và tên</label>
                <input 
                {...register("fullName", { required: true })} 
                type="text" name="fullName" id="fullName" placeholder='Họ và tên'
                className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow'
                />
                {errors.fullName && <p className='mt-1 text-xs text-red-500'>Họ và tên là bắt buộc.</p>}
            </div>
            <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="email">Email</label>
                <input 
                {...register("email", { required: true })} 
                type="email" name="email" id="email" placeholder='Địa chỉ email'
                className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow'
                />
                {errors.email && <p className='mt-1 text-xs text-red-500'>Email hợp lệ là bắt buộc.</p>}
            </div>
            <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="password">Mật khẩu</label>
                <input 
                {...register("password", { required: true, minLength: 8 })} 
                type="password" name="password" id="password" placeholder='Mật khẩu'
                className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow'
                />
                {errors.password && <p className='mt-1 text-xs text-red-500'>Mật khẩu phải có ít nhất 8 ký tự.</p>}
            </div>
            <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="phone">Điện thoại</label>
                <input 
                {...register("phone")} 
                type="text" name="phone" id="phone" placeholder='Số điện thoại'
                className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow'
                />
            </div>
            <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="address">Địa chỉ</label>
                <input 
                {...register("address")} 
                type="text" name="address" id="address" placeholder='Địa chỉ'
                className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow'
                />
            </div>
            {
                message && <p className='text-red-500 text-xs italic mb-3'>{message}</p>
            }
            <div>
                <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none'>Đăng ký</button>
            </div>
        </form>
        <p className='align-baseline font-medium mt-4 text-sm'>Đã có tài khoản? <Link to="/login" className='text-blue-500 hover:text-blue-700'>Đăng nhập</Link></p>
    </div>
</div>
  )
}

export default Register