import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd';
import './index.css'

import {
  UserOutlined,
  UploadOutlined,
  BarsOutlined,
  HomeOutlined,
  DesktopOutlined,
} from '@ant-design/icons';
import SubMenu from 'antd/lib/menu/SubMenu';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'

const { Sider } = Layout;

//模拟数组结构,占据位置放置重绘,删除会导致刷新慢
let data = [
  {
    "id": 1,
    "key": "/home",
    "title": "首页",
    "pagePermission": 1,
    "grade": 1,
    "children": []
  },
  {
    "id": 2,
    "key": "/user-manage",
    "title": "用户管理",
    "pagePermission": 1,
    "grade": 1,
    "children": [
      {
        "id": 3,
        "title": "添加用户",
        "rightId": 2,
        "key": "/user-manage/add",
        "grade": 2
      },
      {
        "id": 4,
        "title": "删除用户",
        "rightId": 2,
        "key": "/user-manage/delete",
        "grade": 2
      },
      {
        "id": 5,
        "title": "修改用户",
        "rightId": 2,
        "key": "/user-manage/update",
        "grade": 2
      },
      {
        "id": 6,
        "title": "用户列表",
        "rightId": 2,
        "key": "/user-manage/list",
        "pagePermission": 1,
        "grade": 2
      }
    ]
  },
  {
    "id": 7,
    "key": "/right-manage",
    "title": "权限管理",
    "pagePermission": 1,
    "grade": 1,
    "children": [
      {
        "id": 8,
        "title": "角色列表",
        "rightId": 7,
        "key": "/right-manage/role/list",
        "pagePermission": 1,
        "grade": 2
      },
      {
        "id": 9,
        "title": "权权限色",
        "rightId": 7,
        "key": "/right-manage/right/list",
        "pagePermission": 1,
        "grade": 2
      }
    ]
  },
  {
    "id": 14,
    "key": "/news-manage",
    "title": "新闻管理管理",
    "pagePermission": 1,
    "grade": 1,
    "children": [
      {
        "id": 10,
        "title": "撰写新闻",
        "rightId": 14,
        "key": "/news-manage/add",
        "pagePermission": 1,
        "grade": 2
      },
      {
        "id": 11,
        "title": "草稿箱",
        "rightId": 14,
        "key": "/news-manage/draft",
        "pagePermission": 1,
        "grade": 2
      },
      {
        "id": 12,
        "title": "新闻分类",
        "rightId": 14,
        "key": "/news-manage/category",
        "pagePermission": 1,
        "grade": 2
      }
    ]
  },
  {
    "id": 21,
    "key": "/audit-manage",
    "title": "审核管理",
    "pagePermission": 1,
    "grade": 1,
    "children": [
      {
        "id": 23,
        "title": "审核列表",
        "rightId": 21,
        "key": "/audit-manage/list",
        "pagePermission": 1,
        "grade": 2
      }
    ]
  },
  {
    "id": 24,
    "key": "/publish-manage/",
    "title": "发布管理",
    "pagePermission": 1,
    "grade": 1,
    "children": [
      {
        "id": 25,
        "title": "待发布",
        "rightId": 24,
        "key": "/publish-manage/unpublished",
        "pagePermission": 1,
        "grade": 2
      },
      {
        "id": 27,
        "title": "已发布",
        "rightId": 24,
        "key": "/publish-manage/published",
        "pagePermission": 1,
        "grade": 2
      }
    ]
  }
]
export default function Sidemenu() {
  const [menuList, setMenuList] = useState(data)
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
    // "/publish-manage": <MoreOutlined />,
  }
  //请求数据
  useEffect(() => {
    axios.get("/ajax/right?_embed=children").then((resolve) => {
      // console.log(resolve.data);
      setMenuList(resolve.data)
    })
  }, [])
  //过滤信息
  const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
  const checkPagePermission = function (item) {
    return item.pagePermission === 1 && rights.includes(item.key)
  }
  const checkPath = (path1, path2) => {
    if (path1 === "/" && path2 === '/') {
      navigate('/home')
    }
  }
  const renderMenu = (menuList) => {
    return menuList.map(Item => {
      if (Item.children?.length > 0 && checkPagePermission(Item)) {
        return <SubMenu key={Item.key} icon={iconMap[Item.key]} title={Item.title}>
          {renderMenu(Item.children)}
        </SubMenu>
      }
      else return checkPagePermission(Item) && <Menu.Item key={Item.key} icon={iconMap[Item.key]} onClick={() => {
        navigate(Item.key)
      }}>{Item.title}</Menu.Item>
    })
  }
  const { pathname } = useLocation();
  const openKeys = '/' + pathname.split("/")[1]
  // console.log(pathname, openKeys);
  checkPath(pathname, openKeys)
  return (
    <Sider trigger={null} collapsed={false}  >
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
        <div className="logo" >新闻发布系统</div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Menu theme="dark" mode="inline" selectedKeys={[pathname]} defaultOpenKeys={[openKeys]}>
            {renderMenu(menuList)}
          </Menu>
        </div>

      </div>

    </Sider>)

}
