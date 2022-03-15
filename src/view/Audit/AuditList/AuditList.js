import axios from 'axios'
import React from 'react'
import { useState, useEffect } from 'react';
import { Button, Table, Tag, Modal } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons"
import { Link } from 'react-router-dom';
export default function AuditList() {
  const [dataSource, setdataSource] = useState([])
  const { username } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    //寻找未发布的
    axios.get(`/ajax/news?author=${username}&auditState_ne=0&pubilshState_lte=1&_expand=category`).then(res => {
      console.log(res.data);
      setdataSource(res.data)
    })
  }, [username])
  const { confirm } = Modal;
  const confirmMethod = (item) => {
    confirm({
      title: '你确定要删除么?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteMethod(item)
      },
      onCancel() {
      },
    });
  }
  const deleteMethod = (item) => {
    console.log(item);
    //本地删除,后端删除
    if (item.grade === 1) {
      setdataSource(dataSource.filter((value) => value.id === item.rightId))
      axios.delete(`/ajax/right/${item.id}`)
    }
    else {
      let list = dataSource.filter((value) => value.id !== item.id)
      list[0].children = list[0].children.filter(value => value.id !== item.id)
      setdataSource([...dataSource])
      axios.delete(`/ajax/children/${item.id}`)
    }
  }
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <Link to={`/news-manage/preview/${item.id}`}>{title}</Link>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => {
        return <div>{category?.title}</div>
      }
    },
    {
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => {
        return auditState
      }
    }, {
      title: '操作',
      render: (item) => {
        return <div >
          <Button danger
            onClick={() => confirmMethod(item)}>发布</Button>



        </div>
      }
    }
  ];
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{
        pageSize: 5
      }} rowKey={(item) => item.id} /></div>
  )
}
