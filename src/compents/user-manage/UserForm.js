import React, { forwardRef, useState, useEffect } from 'react'
import { Form, Input, Select } from 'antd'
const { Option } = Select;
const UserForm = forwardRef((props, ref) => {
    const [isSuperManage, setisSuperManage] = useState(false)
    // const [regionState, setregionState] = useState("")
    useEffect(() => {
        setisSuperManage(props.isUpdateDisabled)
    }, [props.isUpdateDisabled])
    return (
        <Form
            ref={ref}
            layout="vertical"
        >
            <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: '请输入用户名!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: '请输入密码!' }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={isSuperManage ? [] : [{ required: true, message: '请选择正确的区域' }]}

            >
                <Select disabled={isSuperManage} >
                    {props.regionList.map(item => {
                        return <Option value={item.id} key={item.id}>{item.value}</Option>
                    })}

                </Select>
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Select onChange={(value) => {
                    if (value === 1) {
                        setisSuperManage(true)
                        //向上提交空数据
                        ref.current.setFieldsValue({
                            region: "全球"
                        })
                    }
                    else {
                        setisSuperManage(false)
                        //设置上次选中的位置
                        ref.current.setFieldsValue({
                            region: "亚洲"
                        })
                    }
                }} >
                    {props.roleList.map(item => {
                        return <Option value={item.id} key={item.id}>{item.roleName}</Option>
                    })}

                </Select>
            </Form.Item>

        </Form>
    )
})
export default UserForm