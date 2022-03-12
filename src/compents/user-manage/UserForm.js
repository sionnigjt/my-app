import React, { forwardRef, useState, useEffect } from 'react'
import { Form, Input, Select } from 'antd'
const { Option } = Select;
const UserForm = forwardRef((props, ref) => {
    const [isSuperManage, setisSuperManage] = useState(false)
    // const [regionState, setregionState] = useState("")
    //默认选择亚洲
    const [rememberRegion, setrememberRegion] = useState("亚洲")
    useEffect(() => {
        setisSuperManage(props.isUpdateDisabled)
    }, [props.isUpdateDisabled])

    const { roleId, region } = JSON.parse(localStorage.getItem('token'))
    const roleObj = {
        "1": "superadmin",
        "2": "admin",
        "3": "editor"
    }
    const checkRegionDisabled = (item) => {

        if (props.isUpdata) {
            //如果是管理员
            if (roleObj[roleId] === "superadmin") {
                return false
            }
            else {
                return true
            }
        }
        else {
            //如果是管理员
            if (roleObj[roleId] === "superadmin") {
                return false
            }
            else {
                return item.value !== region
            }
        }
    }
    const checkRoleDisabled = (item) => {
        if (props.isUpdata) {
            //如果是管理员
            if (roleObj[roleId] === "superadmin") {
                return false
            }
            else {
                return true
            }
        }
        else {
            //如果是管理员
            if (roleObj[roleId] === "superadmin") {
                return false
            }
            else {
                return roleObj[item.id] !== "editor"
            }
        }
    }
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
                        return <Option value={item.value} key={item.id} disabled={checkRegionDisabled(item)}>{item.value}</Option>
                    })}

                </Select>
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Select onChange={(value) => {
                    setrememberRegion(ref.current.getFieldValue('region') === "全球" ? rememberRegion : ref.current.getFieldValue('region'))
                    if (value === 1) {
                        setisSuperManage(true)
                        //向上提交空数据
                        ref.current.setFieldsValue({
                            region: "全球"
                        })
                    }
                    else {

                        setisSuperManage(false)
                        // 设置上次选中的位置
                        ref.current.setFieldsValue({
                            region: rememberRegion
                        })
                    }
                }} >
                    {props.roleList.map(item => {
                        return <Option value={item.id} key={item.id} disabled={checkRoleDisabled(item)}>{item.roleName}</Option>
                    })}

                </Select>
            </Form.Item>

        </Form>
    )
})
export default UserForm