import axios from 'axios'
import React from 'react'
import { useState, useEffect } from 'react';
import { Button, Table, Tag, Modal, notification } from 'antd'
import { ExclamationCircleOutlined } from "@ant-design/icons"
import { Link, useNavigate } from 'react-router-dom';
export default function AuditList() {
  const [dataSource, setdataSource] = useState([])
  const { username } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    //寻找未发布的
    axios.get(`/ajax/news?author=${username}&auditState_ne=0&pubilshState_lte=1&_expand=category`).then(res => {
      // console.log(res.data);
      setdataSource(res.data)
    })
  }, [username])
  const { confirm } = Modal;
  const BackupList = (id) => {
    confirm({
      title: '你确定要撤销么?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        //本地删除
        setdataSource(dataSource.filter(data => data.id !== id))
        //后端删除
        axios.patch(`/ajax/news/${id}`, {
          auditState: 0
        }).then(res => {
          notification.info({
            message: `通知`,
            description:
              `你可以到草稿箱中查看您的新闻`,
            placement: "bottomRight"
          });
        })
      },
      onCancel() {
      },
    });
  }
  const Navigate = useNavigate()
  const updateList = (id) => {
    //跳转页面
    Navigate(`/news-manage/update/${id}`)
  }
  const publishList = (id) => [
    axios.patch(`/ajax/news/${id}`, {
      "pubilshState": 2,
      "publishTime": Date.now()
    }).then(res => {
      Navigate('/publish-manage/published')
      notification.info({
        message: `通知`,
        description:
          `发布成功`,
        placement: "bottomRight"
      });
    })
  ]
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
        let colorList = ['black', 'orange', 'green', 'red']
        let AuditList = ["未审核", "待审核", "已通过", "未通过"]
        return <Tag color={colorList[auditState]}>{AuditList[auditState]}</Tag>
      }
    }, {
      title: '操作',
      render: (item) => {
        return <div >
          {
            item.auditState === 1 && <Button onClick={() => BackupList(item.id)} >撤销</Button>
          }
          {
            item.auditState === 2 && <Button danger onClick={() => { publishList(item.id) }}>发布</Button>
          }
          {
            item.auditState === 3 && <Button type='primary' onClick={() => updateList(item.id)}>更新</Button>
          }
          {/* <Button danger
            onClick={() => confirmMethod(item)}>发布</Button> */}
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
