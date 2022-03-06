import React from 'react'
import { useState, useEffect } from 'react';
import { Button, Table, Tag, Modal, Popover, Switch } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons"

import axios from 'axios';
export default function RightManageList() {
  const [dataSource, setdataSource] = useState()
  useEffect(() => {
    axios.get("http://localhost:5000/right?_embed=children").then((res) => {
      setdataSource(res.data)
    })
  }, [])
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
    axios.delete(`http://localhost:5000/right/${item.id}`)
  }
  const SwitchChange = (item) => {
    //页面更新
    item.pagePermission = item.pagePermission === 1 ? 0 : 1
    setdataSource([...dataSource])
    //后端更新:等滑块动作完成后在更新
    let sleep = (item) => new Promise((resolve) => {
      setTimeout(resolve, 500, item)
    })
    const Patchdatas = () => {
      if (item.grade === 1) {
        axios.patch(`http://localhost:5000/right/${item.id}`, { pagePermission: item.pagePermission }).then(function (response) {
          console.log(response);
        }).catch(e => { console.log(e); })
      }
      else {
        axios.patch(`http://localhost:5000/children/${item.id}`, { pagePermission: item.pagePermission }).then(function (response) {
          console.log(response);
        })
      }
    }
    sleep(item).then(Patchdatas)


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
      title: '权限名称',
      dataIndex: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => {
        return <Tag color="orange">{key}</Tag>
      }
    }, {
      title: '操作',
      render: (item) => {
        return <div >
          <Button danger shape="circle" icon={<DeleteOutlined></DeleteOutlined>}
            onClick={() => confirmMethod(item)}></Button>
          <Popover content={<div><Switch checked={item.pagePermission} onChange={() => SwitchChange(item)}></Switch></div>} title="页面配置项" trigger={item.pagePermission === undefined ? "" : "click"}>
            <Button type='primary' shape='circle' icon={<EditOutlined />} style={{ padding: '0 0 0 0.5em', margin: '0 0 0 0.3em' }}
              disabled={item.pagePermission === undefined}>  </Button>
          </Popover>

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
