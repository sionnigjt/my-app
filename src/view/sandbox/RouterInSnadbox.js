import React, { useState, useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Home from '../Home/Home'
import Userlist from '../user-manage/Userlist'
import RightManageList from '../right-manage/RightManageList'
import RightRoleList from '../right-manage/RightRoleList'
import WriteNews from '../News/WriteNews/WriteNews'
import DraftBox from '../News/DraftBox/DraftBox'
import AuditList from '../Audit/AuditList/AuditList'
import CategoryNews from '../News/CategoryNews/CategoryNews'
import NotFound from '../../compents/404/NotFound'
import Published from '../../view/Publish/published/Published'
import Uppublished from '../../view/Publish/unpublished/Unpublished'
import NewsPreview from '../../compents/News/NewsPreview'
import NewsUpdate from '../News/NewsUpdate/NewsUpdate'
import axios from 'axios'
export default function RouterInSnadbox() {
    const routerMap = {
        '': <Home />,
        '/home': <Home />,
        '/user-manage/list': <Userlist></Userlist>,
        '/right-manage/right/list': < RightManageList ></RightManageList>,
        '/right-manage/role/list': <RightRoleList></RightRoleList>,
        '/news-manage/add': <WriteNews></WriteNews>,
        '/news-manage/draft': <DraftBox></DraftBox>,
        '/news-manage/category': <CategoryNews></CategoryNews>,
        '/news-manage/preview/:id': <NewsPreview></NewsPreview>,
        '/news-manage/update/:id': <NewsUpdate></NewsUpdate>,
        '/audit-manage/list': <AuditList></AuditList>,
        '/publish-manage/unpublished': <Uppublished></Uppublished>,
        '/publish-manage/published': <Published></Published>,
        '*': <NotFound />
    }
    const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
    const [RouteList, setRouteList] = useState([])
    useEffect(() => {
        Promise.all([
            axios.get("/ajax/right"),
            axios.get("/ajax/children")
        ]).then(res => {
            setRouteList([...res[0].data, ...res[1].data])
        })
    }, [])
    const checkRoute = (item) => {

        // return true
        return rights.includes(item.key) && (item.routePermission === 1 || item.pagePermission === 1)
    }
    const createRoute = (routerMap) => {
        return RouteList.map(item => {
            if (checkRoute(item)) {
                return <Route path={item.key} element={routerMap[item.key]} key={item.id}></Route>
            }
            else return <Route path={"*"} element={<NotFound />} key={-1}></Route>
        })
    }
    return (
        <Routes>
            {createRoute(routerMap)}
        </Routes>
    )
}
