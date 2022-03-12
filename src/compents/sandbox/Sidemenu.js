import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd';
import './index.css'

import {
  UserOutlined,
  UploadOutlined,
  BarsOutlined,
  HomeOutlined,
  DesktopOutlined,
  MoreOutlined
} from '@ant-design/icons';
import SubMenu from 'antd/lib/menu/SubMenu';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

const { Sider } = Layout;

//模拟数组结构

export default function Sidemenu() {
  const [menuList, setMenuList] = useState([])
  const navigate = useNavigate()
  const iconMap = {
    "/home": <HomeOutlined />,
    "/user-manage": <UserOutlined />,
    "/user-manage/list": <UserOutlined />,
    "/right-manage": <UploadOutlined></UploadOutlined>,
    // "/right-manage/role/list": <UploadOutlined></UploadOutlined>,
    "/news-manage": <BarsOutlined />,
    "/audit-manage": <DesktopOutlined />,
    "/audit-manage/list": <DesktopOutlined />,
    "/publish-manage": <MoreOutlined />,
    "/audit-manage/unpublished": <MoreOutlined />,
    "/audit-manage/published": <MoreOutlined />,
  }
  useEffect(() => {
    axios.get("http://localhost:5000/right?_embed=children").then((resolve) => {
      // console.log(resolve.data);
      setMenuList(resolve.data)
    })
  }, [])
  //过滤信息
  const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
  const checkPagePermission = function (item) {
    return item.pagePermission === 1 && rights.includes(item.key)
  }

  const renderMenu = (menuList) => {
    return menuList.map(Item => {
      if (Item.children?.length > 0 && checkPagePermission(Item)) {
        return <SubMenu key={Item.key} icon={iconMap[Item.key]} title={Item.title}>
          {renderMenu(Item.children)}
        </SubMenu>
      }
      else return checkPagePermission(Item) && <Menu.Item key={Item.id} icon={iconMap[Item.key]} onClick={() => {
        navigate(Item.key)
      }}>{Item.title}</Menu.Item>
    })
  }
  return (
    <Sider trigger={null} collapsed={false}  >
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
        <div className="logo" >新闻发布系统</div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            {renderMenu(menuList)}
          </Menu>
        </div>

      </div>

    </Sider>)

}
