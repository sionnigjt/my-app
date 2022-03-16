import axios from 'axios';
import React from 'react'
import { useState, useEffect } from 'react';
import { Button, Table, notification } from 'antd'
import { DeleteOutlined, EditOutlined, } from "@ant-design/icons"
export default function AuditManage() {
  const [dataSource, setdataSource] = useState()
  useEffect(() => {
    let roleObj = {
      "1": "superadmin",
      "2": "admin",
      "3": "editor"
    }
    let { roleId, region, username } = JSON.parse(localStorage.getItem('token'))
    axios.get(`/ajax/news?auditState=1&_expand=category`).then(res => {
      const list = res.data
      setdataSource(roleObj[roleId] === "superadmin" ? list : [
        //过滤不在同一个区域的,权限大于等于的
        ...list.filter(item => item.author === username || (item.region === region && roleObj[item.roleId] === "editor")),

      ])
    })
  }, [])
  const handleAudit = (item, auditState, pubilshState) => {
    setdataSource(dataSource.filter(value => value.id !== item.id))
    axios.patch(`/ajax/news/${item.id}`, {
      auditState,
      pubilshState
    }).then(res => {
      notification.info({
        message: `通知`,
        description:
          `新闻已提交`,
        placement: "bottomRight"
      });
    })
  }
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title) => {
        return title
      }

    },
    {
      title: '作者',
      dataIndex: 'author',
      render: (author) => {
        return <div>{author}</div>
      }
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => {
        return <div>{category.title
        }</div>
      }
    }, {
      title: '操作',
      render: (item) => {
        return <div >
          <Button type='primary' icon={<EditOutlined />} disabled={item.default} onClick={() => { handleAudit(item, 2, 1) }}>
            通过</Button>
          <Button danger icon={<DeleteOutlined></DeleteOutlined>} onClick={() => { handleAudit(item, 3, 0) }}
          >驳回</Button>
        </div>
      }
    }
  ];
  return (
    <div>   <Table dataSource={dataSource} columns={columns} pagination={{
      pageSize: 5
    }} rowKey={(item) => item.id} /></div>
  )
}
