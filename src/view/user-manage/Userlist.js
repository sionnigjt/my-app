import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { Button, Table, Modal, Switch } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons"
import UserForm from '../../compents/user-manage/UserForm';
import axios from 'axios';
//用户管理界面
export default function Userlist() {
    // 表单数据源
    const [dataSource, setdataSource] = useState()
    const [isAddVisible, setisAddVisible] = useState(false)
    const [isChangeVisible, SetisChangeVisible] = useState(false)
    //添加用户组件中需要的信息,如地区,管理员类别
    const [regionList, setregionList] = useState([])
    const [roleList, setroleList] = useState([])
    const AddFromRef = useRef(null)
    const ChangeFormRef = useRef(null)
    const [isUpdateDisabled, setisUpdateDisabled] = useState(false)
    const [currentUser, setcurrentUser] = useState(null)
    useEffect(() => {
        axios.get('http://localhost:5000/users?_expand=role').then((res) => {
            setdataSource(res.data)
        })
    }, [])
    useEffect(() => {
        axios.get('http://localhost:5000/roles').then((res) => {
            setroleList(res.data)
        })
    }, [])
    useEffect(() => {
        axios.get('http://localhost:5000/regions').then((res) => {
            setregionList(res.data)
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
        //本地删除,后端删除
        setdataSource(dataSource.filter((value) => value.id !== item.id))
        axios.delete(`http://localhost:5000/users/${item.id}`)
    }
    const SwitchChange = (item) => {
        //页面更新
        item.roleSate = !item.roleSate
        console.log(dataSource);
        setdataSource([...dataSource])
        //后端更新:等滑块动作完成后在更新,并且这里这里使用节流和防抖方法
        let sleep = (item) => new Promise((resolve) => {
            setTimeout(resolve, 500, item)
        })
        const Patchdatas = () => {
            axios.patch(`http://localhost:5000/users/${item.id}`, { "roleSate": item.roleSate }).then(function (response) {
                console.log(response);
            }).catch(e => { console.log(e); })

        }
        sleep(item).then(Patchdatas)


    }
    const AddFromOK = () => {
        AddFromRef.current.validateFields().then(value => {
            setisAddVisible(false)
            console.log(value);
            axios.post("http://localhost:5000/users", {
                ...value,
                "roleSate": true,
                "default": false,
            })
                .then(res => {
                    console.log(res.data);
                    setdataSource([...dataSource, {
                        ...res.data,
                        role: roleList.filter(item => item.id === value.roleId)[0]
                    }])
                })
        })
    }
    const ChangeFormOk = () => {
        SetisChangeVisible(false)
        ChangeFormRef.current.validateFields().then(value => {
            console.log(value);
            setdataSource(dataSource.map(item => {
                if (item.id === currentUser.id) {
                    return {
                        ...item,
                        ...value,
                    }
                }
                return item
            }))
        })
    }
    const handleUpdate = (item) => {
        //变成同步触发
        setTimeout(() => {
            SetisChangeVisible(true)
            if (item.roleId === 1) {
                //禁用
                setisUpdateDisabled(true)
            }
            else {
                //非禁用
                setisUpdateDisabled(false)
            }
            ChangeFormRef.current.setFieldsValue(item)
        }, 0)
        setcurrentUser(item)

    }
    //渲染的每列数据名称
    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            render: (region) => {
                if (region.length > 0)
                    return <b>{region
                    }</b>
                else return <b>全球</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render: (role) => {
                return <div>{role.roleName}</div>
            }
        },
        {
            title: '用户名',
            dataIndex: 'username',
            render: (username) => {
                return <div>{username
                }</div>
            }
        }, {


            title: '用户状态',
            dataIndex: 'roleSate',
            render: (roleSate, item) => {
                return <Switch checked={roleSate} disabled={item.default} onChange={() => SwitchChange(item)}></Switch>

            }
        }, {
            title: '操作',
            render: (item) => {
                return <div >
                    <Button danger shape="circle" icon={<DeleteOutlined></DeleteOutlined>}
                        onClick={() => confirmMethod(item)} disabled={item.default}></Button>

                    <Button type='primary' shape='circle' icon={<EditOutlined />} style={{ padding: '0 0 0 0.5em', margin: '0 0 0 0.3em' }} disabled={item.default}
                        onClick={() => {
                            handleUpdate(item);
                        }}
                    >  </Button>


                </div>
            }
        }
    ];
    // console.log(dataSource);
    return (
        <div>
            <Button type='primary' onClick={() => { setisAddVisible(true) }}>添加用户</Button>
            <Table dataSource={dataSource} columns={columns} pagination={{
                pageSize: 5
            }} rowKey={(item) => item.id} />
            <Modal
                visible={isAddVisible}
                title="创建新用户"
                okText="确定"
                cancelText="取消"
                onCancel={() => {
                    setisAddVisible(false)
                }}
                onOk={() => AddFromOK()
                }
            >
                {/* 注意:这里使用高阶函数forwardRef从子级组件取值 */}
                <UserForm regionList={regionList} roleList={roleList}
                    ref={AddFromRef}></UserForm>
            </Modal>
            <Modal
                visible={isChangeVisible}
                title="更新用户"
                okText="更新"
                cancelText="取消"
                onCancel={(item) => {
                    SetisChangeVisible(false)
                    setisUpdateDisabled(!isUpdateDisabled)
                }}
                onOk={() => ChangeFormOk()
                }
            >
                {/* 注意:这里使用高阶函数forwardRef从子级组件取值 */}
                <UserForm regionList={regionList} roleList={roleList}
                    ref={ChangeFormRef} isUpdateDisabled={isUpdateDisabled}></UserForm>
            </Modal>
        </div >
    )
}
