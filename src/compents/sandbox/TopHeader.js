import React, { useState } from 'react'
import { Header } from 'antd/lib/layout/layout'
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Dropdown, Menu, Avatar } from 'antd';

export default function TopHeader() {
    const [collapsed, setCollapsed] = useState(false);
    const changeCollapsed = () => {
        setCollapsed(!collapsed)
    }
    const menu = (
        <Menu >
            <Menu.Item>
                超级管理员
            </Menu.Item>
            <Menu.Item danger={true}>
                退出
            </Menu.Item>
        </Menu>
    )
    return (
        <Header className="site-layout-background" style={{ padding: 0 }}>

            {collapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} style={{ padding: '0 25px' }} ></MenuUnfoldOutlined> : <MenuFoldOutlined onClick={changeCollapsed} style={{ padding: '0 25px' }}></MenuFoldOutlined>}
            <div style={{ float: "right", padding: "0 1em 0 0" }}>
                <span >欢迎回来</span>
                <Dropdown overlay={menu}>
                    <span style={{ padding: "0 0.5em 0 0.5em" }}>hover me</span>
                </Dropdown>
                <Avatar icon={<UserOutlined />} />
            </div>
        </Header >

    )
}
