import React from 'react'
import { useState, useEffect } from 'react';
import { Button, Table, Modal, notification } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, UploadOutlined } from "@ant-design/icons"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
export default function DraftBox() {
  const [dataSource, setdataSource] = useState()
  const { username } = JSON.parse(localStorage.getItem('token'))
  const Navigate = useNavigate()
  useEffect(() => {
    axios.get(`/ajax/news?author=${username}&auditState=0&_expand=category`).then((res) => {
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
    setdataSource(dataSource.filter((value) => value.id !== item.id))
    axios.delete(`/ajax/news/${item.id}`)
  }
  const handleCheckUpload = (id) => {
    axios.patch(`/ajax/news/${id}`, {
      'auditState': 1
    }).then(res => {
      Navigate(`/audit-manage/list`)
      notification.info({
        message: `通知`,
        description:
          `你可以到审核列表中查看您的新闻`,
        placement: "bottomRight"
      });
    })
  }
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (dataIndex, item) => {
        return <Link to={`../news-manage/preview/${item.id}`} >{dataIndex}</Link>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',

    },
    {
      title: '分类',
      dataIndex: 'category',
      render: (category) => {
        return category.title
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div >
          <Button danger shape="circle" icon={<DeleteOutlined></DeleteOutlined>}
            onClick={() => confirmMethod(item)}></Button>
          <Button shape='circle' icon={<EditOutlined />} style={{ padding: '0 0 0 0.5em', margin: '0 0 0 0.3em' }}
            onClick={
              () => {
                // console.log(1);
                Navigate(`/news-manage/update/${item.id}`)
              }
            } >  </Button>
          <Button type='primary' shape='circle' icon={<UploadOutlined />} style={{ padding: '0 0 0 0.5em', margin: '0 0 0 0.3em' }}
            onClick={() => { handleCheckUpload(item.id) }}>  </Button>
        </div>
      }
    }
  ];
  // console.log(dataSource);
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{
        pageSize: 5
      }} rowKey={(item) => item.id} />

    </div>
  )
}
