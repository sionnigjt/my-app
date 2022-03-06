import React from 'react'
import { useState, useEffect } from 'react';
import { Button, Table, Modal, Popover, Switch, Form, Input } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons"

import axios from 'axios';
export default function Userlist() {
    const [dataSource, setdataSource] = useState()
    const [isAddVisible, setisAddVisible] = useState(false)
    useEffect(() => {
        axios.get('http://localhost:5000/users?_expand=role').then((res) => {
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
                return <Switch checked={roleSate} disabled={item.default}></Switch>

            }
        }, {
            title: '操作',
            render: (item) => {
                return <div >
                    <Button danger shape="circle" icon={<DeleteOutlined></DeleteOutlined>}
                        onClick={() => confirmMethod(item)} disabled={item.default}></Button>
                    <Popover content={<div><Switch checked={item.pagePermission} onChange={() => SwitchChange(item)}></Switch></div>} title="页面配置项" trigger={item.pagePermission === undefined ? "" : "click"}>
                        <Button type='primary' shape='circle' icon={<EditOutlined />} style={{ padding: '0 0 0 0.5em', margin: '0 0 0 0.3em' }}
                            disabled={item.default}>  </Button>
                    </Popover>

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
                onOk={() => {
                    console.log('add');
                }}
            >
                <Form
                    layout="vertical"
                >
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: 'Please input the title of collection!' }]}
                    >
                        <Input />
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    )
}
