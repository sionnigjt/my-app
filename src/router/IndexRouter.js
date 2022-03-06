import React from 'react'
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom'
import Login from '../view/login/Login'
import Sandbox from '../view/sandbox/Sandbox'


//管理登录
export default function IndexRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path="*" element={localStorage.getItem('token') ? <Sandbox /> : <Navigate to="/login" ></Navigate>} />
            </Routes>
        </BrowserRouter>
    )
}
