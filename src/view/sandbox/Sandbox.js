import React from 'react'
import SideMenu from '../../compents/sandbox/Sidemenu'
import TopHeader from '../../compents/sandbox/TopHeader'
import RouterInSnadbox from './RouterInSnadbox'
import './SandBox.css'
import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
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
                    <RouterInSnadbox></RouterInSnadbox>

                </Content>
            </Layout>

        </Layout>

    )
}
