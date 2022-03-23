import React from 'react'
import { Header } from 'antd/lib/layout/layout'
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'
import { Dropdown, Menu, Avatar } from 'antd';
import { connect } from 'react-redux'
function TopHeader(props) {
    // console.log(props);
    const Navigate = useNavigate()
    const { role: { roleName }, username } = JSON.parse(localStorage.getItem('token'))
    const changeCollapsed = () => {
        // 改变state的状态
        props.changeCollapsed()
    }
    const quitLgin = () => {
        Navigate("/login")
        localStorage.removeItem('token')
    }
    const menu = (
        <Menu >
            <Menu.Item>
                {roleName}
            </Menu.Item>
            <Menu.Item danger={true} onClick={() => quitLgin()}>
                退出
            </Menu.Item>
        </Menu>
    )
    return (
        <Header className="site-layout-background" style={{ padding: 0 }}>

            {props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} style={{ padding: '0 25px' }} ></MenuUnfoldOutlined> : <MenuFoldOutlined onClick={changeCollapsed} style={{ padding: '0 25px' }}></MenuFoldOutlined>}
            <div style={{ float: "right", padding: "0 1em 0 0" }}>
                <span style={{ padding: '0 0.5em 0 0' }} >欢迎{username}回来</span>
                <Dropdown overlay={menu}>
                    <Avatar icon={<UserOutlined />} />
                </Dropdown>

            </div>
        </Header >

    )
}
//connect执行后返回的函数用来包装
/*可选参数
 mapStateToprops
 mapDispatchToprops
 */
const mapStateToprops = ({ CollapsedReducer: { isCollapsed } }) => {
    return {
        isCollapsed
    }
}
const mapDispatchToProps = {
    changeCollapsed() {
        return {
            type: "cahnge_collapsed"
        }
    }
}
export default connect(mapStateToprops, mapDispatchToProps)(TopHeader) 