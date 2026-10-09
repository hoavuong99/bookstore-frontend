/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Link,  useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from '../context/AuthContext';
import { showErrorToast, showSuccessToast } from '../utils/toast';

const Register = () => {
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const {registerUser} = useAuth();
    const navigate = useNavigate();

    // console.log(registerUser)
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm()
    const passwordValue = watch("password", "");

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

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
                {...register("email", {
                    required: "Email là bắt buộc.",
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email không hợp lệ." },
                })}
                type="email" name="email" id="email" placeholder='Địa chỉ email'
                className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow'
                />
                {errors.email && <p className='mt-1 text-xs text-red-500'>{errors.email.message}</p>}
            </div>
            <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="password">Mật khẩu</label>
                <div className="relative">
                <input
                {...register("password", {
                    required: true,
                    pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d).{8,128}$/,
                        message: "Mật khẩu phải có ít nhất 8 ký tự, gồm cả chữ và số.",
                    },
                })}
                type={showPassword ? "text" : "password"} name="password" id="password" placeholder='Mật khẩu'
                className='shadow appearance-none border rounded w-full py-2 pl-3 pr-10 leading-tight focus:outline-none focus:shadow'
                />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                </div>
                <p className='mt-1 text-xs text-gray-500'>Mật khẩu phải có ít nhất 8 ký tự, gồm cả chữ và số.</p>
                {errors.password && <p className='mt-1 text-xs text-red-500'>{errors.password.message || "Mật khẩu phải có ít nhất 8 ký tự, gồm cả chữ và số."}</p>}
            </div>
            <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                <div className="relative">
                <input
                {...register("confirmPassword", {
                    required: "Vui lòng xác nhận mật khẩu.",
                    validate: (value) => value === passwordValue || "Mật khẩu xác nhận không khớp.",
                })}
                type={showConfirmPassword ? "text" : "password"} name="confirmPassword" id="confirmPassword" placeholder='Nhập lại mật khẩu'
                className='shadow appearance-none border rounded w-full py-2 pl-3 pr-10 leading-tight focus:outline-none focus:shadow'
                />
                <button type="button" onClick={() => setShowConfirmPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" aria-label={showConfirmPassword ? "Ẩn mật khẩu xác nhận" : "Hiện mật khẩu xác nhận"}>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                </div>
                {errors.confirmPassword && <p className='mt-1 text-xs text-red-500'>{errors.confirmPassword.message}</p>}
            </div>
            <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="phone">Điện thoại</label>
                <input 
                {...register("phone", {
                    validate: (value) => !value || /^\d{8,20}$/.test(value) || "Số điện thoại phải gồm 8-20 chữ số.",
                })}
                type="text" name="phone" id="phone" placeholder='Số điện thoại'
                className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow'
                />
                {errors.phone && <p className='mt-1 text-xs text-red-500'>{errors.phone.message}</p>}
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