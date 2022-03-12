import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Button, Table, Modal, Tree } from 'antd'
import { DeleteOutlined, UnorderedListOutlined, ExclamationCircleOutlined } from "@ant-design/icons"
export default function RightRoleList() {
  //数据源,是否显示对话框
  const [dataSource, setDataSource] = useState([])
  const [treeData, setTreeData] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRights, setCurrentRights] = useState([])
  const [currentId, setcurrentId] = useState(-1)
  useEffect(() => {
    axios.get("/ajax/roles").then((res) => {
      setDataSource(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get("/ajax/right?_embed=children").then((res) => {
      // console.log(res.data);
      setTreeData(res.data)
    })
  }, [])

  // console.log(dataSource);
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
    setDataSource(dataSource.filter((value) => value.id !== item.id))
    axios.delete(`/ajax/roles/${item.id}`)
  }
  //权限对话框处理
  const handleOk = (item) => {
    setIsModalVisible(false);
    //同步数据
    //本地的dataSource
    setDataSource(dataSource.map(item => {
      if (item.id === currentId) {
        return {
          ...item,
          rights: currentRights
        }
      }
      return item
    }))
    //更新token
    let user = JSON.parse(localStorage.getItem('token'))
    user.role.rights = currentRights
    localStorage.setItem("token", JSON.stringify(user))
    // 后端数据
    console.log(currentRights);
    axios.patch(`/ajax/roles/${currentId}`, {
      rights: currentRights
    }).then(res => {
      console.log(res);
    })

  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b >{id}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      // dataIndex: 'rights',
      render: (item) => {
        // console.log(rights);
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined></DeleteOutlined>}
            onClick={() => confirmMethod(item)}></Button>
          <Button type='primary' shape='circle' icon={<UnorderedListOutlined />} style={{ padding: '0 0 0 0.5em', margin: '0 0 0 0.3em' }}
            onClick={() => {
              setIsModalVisible(!isModalVisible)
              setCurrentRights(item.rights)
              // console.log(item.rights);
              setcurrentId(item.id)
            }}>  </Button>
        </div>
      }
    },
  ];
  return (
    <div> <Table dataSource={dataSource} columns={columns} pagination={{
      pageSize: 5
    }} rowKey={(item) => item.id} />
      <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          // onSelect={onSelect}
          onCheck={(checkedKeys) => {
            setCurrentRights(checkedKeys.checked)
          }}
          checkable
          checkedKeys={currentRights}
          treeData={treeData}
          checkStrictly={true}
        />
      </Modal>
    </div>
  )
}
