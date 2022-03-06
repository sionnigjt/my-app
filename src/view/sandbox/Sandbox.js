import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SideMenu from '../../compents/sandbox/Sidemenu'
import TopHeader from '../../compents/sandbox/TopHeader'
import Home from '../Home/Home'
import Userlist from '../user-manage/Userlist'
import './SandBox.css'
import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import RightManageList from '../right-manage/RightManageList'
import RightRoleList from '../right-manage/RightRoleList'
export default function Sandbox() {
    return (
        <Layout>
            <SideMenu></SideMenu>
            <Layout className="site-layout">
                <TopHeader></TopHeader>
                <Content className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        overflow: "auto"
                    }}>
                    <Routes>
                        <Route path='/home' element={<Home />}></Route>
                        <Route path='/user-manage/list' element={<Userlist></Userlist>}></Route>
                        <Route path='/right-manage/right/list' element={<RightManageList></RightManageList>}></Route>
                        <Route path='/right-manage/role/list' element={<RightRoleList></RightRoleList>}></Route>
                        <Route path='*' element={<Home />}></Route>
                    </Routes>
                </Content>
            </Layout>

        </Layout>

    )
}
