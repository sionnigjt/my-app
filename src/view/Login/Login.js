import React from 'react'
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './Login.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
//粒子效果有问题
// import Particles from 'react-particles-js';
export default function Login() {
  const Navigate = useNavigate()
  const onFinish = (value) => {
    //json_server受限 没法使用post给后端验证返回token
    axios.get(`http://localhost:5000/users?username=${value.username}&password=${value.password}&roleSate=true&_expand=role`)
      .then(res => {
        localStorage.setItem("token", JSON.stringify(res.data[0]))
        Navigate('/home')
      })
  }
  return (
    <div style={{ background: "rgb(35,39,75)", height: "100%", overflow: "hidden" }}>
      {/* <Particles /> */}
      <div className='loginContent'>
        <div className='loginTitleName'>新闻发布系统</div>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
