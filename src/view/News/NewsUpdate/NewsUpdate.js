import React, { useState, useEffect, useRef } from 'react'
import { Button, PageHeader, Steps, Form, Input, Select, message, notification } from 'antd';
import style from './NewsUpdate.module.css'
import axios from 'axios'
import NewsEditor from '../../../compents/News/NewsEditor';
import { useNavigate, useParams } from 'react-router-dom'
const { Step } = Steps;
const { Option } = Select;

export default function NewsUpdate() {
    const [current, setcurrent] = useState(0)
    const NewsFromRef = useRef(null)
    const [categories, setCategories] = useState([])
    const [NewsTitle, setNewsTitle] = useState({})
    const [NewsContent, setNewsContent] = useState("")
    const [Content, setContent] = useState("")
    const Navigate = useNavigate()
    const params = useParams()
    // console.log(params);
    useEffect(() => {
        axios.get('/ajax/categories').then(res => {
            setCategories(res.data)
            // console.log(categories);
        })
    }, [])
    useEffect(() => {
        axios.get(`/ajax/news/${params.id}?_expand=category&_expand=role`).then(res => {
            let { title, categoryId, content } = res.data
            setContent(content)
            NewsFromRef.current.setFieldsValue({
                title, categoryId
            })
        })
    }, [params.id])


    const handlNext = () => {

        if (current === 0) {
            NewsFromRef.current.validateFields().then(res => {
                setNewsTitle(res);
                setcurrent(current + 1)
            }).catch(error => {
                console.log(error);
            })
        }
        else {
            if (NewsContent === "" || NewsContent.trim() === "<p></p>") {
                message.error("内容不能为空")
            }
            else {
                // console.log(NewsContent, NewsTitle);
                setcurrent(current + 1)
            }

        }
    }
    const handlSave = (auditState) => {
        axios.patch(`/ajax/news${params.id}`, {
            ...NewsTitle,
            "content": NewsContent,
            "auditState": auditState,
        }).then(res => {
            Navigate(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
            notification.info({
                message: `通知`,
                description:
                    `你可以到${auditState === 0 ? '审核箱' : '审核列表'}中查看您的新闻`,
                placement: "bottomRight"
            });
        })
    }
    return (
        <div> <PageHeader
            title="更新新闻"
        />
            <Steps current={current}>
                <Step title="基本信息" description="新闻标题和分类" />
                <Step title="新闻内容" description="新闻主体内容" />
                <Step title="新闻提交" description="保存草稿或提交" />
            </Steps>
            <div style={{ marginTop: "50px" }}>
                <div className={current === 0 ? "" : style.hidden}>
                    <Form
                        name="basic"
                        // labelCol={{ span: 0 }}
                        // wrapperCol={{ span: 20 }}
                        initialValues={{ remember: true }}
                        autoComplete="off"
                        ref={NewsFromRef}
                    >
                        <Form.Item
                            label="新闻标题"
                            name="title"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="新闻分类"
                            name="categoryId"
                            rules={[{ required: true }]}
                        >
                            <Select
                                showSearch
                                placeholder="选择类别"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {
                                    categories.map(Item => {
                                        return <Option value={Item.id} key={Item.title}>{Item.title}</Option>
                                    })
                                }
                                {/* <Option value="jack">Jack</Option>
                                <Option value="lucy">Lucy</Option>
                                <Option value="tom">Tom</Option> */}
                            </Select>
                        </Form.Item>
                    </Form>
                </div>
                <div className={current === 1 ? "" : style.hidden}>
                    <NewsEditor getContent={(value) => {
                        setNewsContent(value)
                        console.log(current);
                    }} content={Content}></NewsEditor>
                </div>
                <div className={current === 2 ? "" : style.hidden}> </div>

            </div>
            <div style={{ marginTop: "50px" }}>
                {current === 2 && <span>
                    <Button type='primary' onClick={() => handlSave(0)}>保存草稿</Button>
                    <Button danger onClick={() => handlSave(1)}>提交审核</Button>
                </span>
                }{
                    current < 2 && <Button type='primary' onClick={() => { handlNext() }}>下一步</Button>
                }
                {current > 0 && <Button onClick={() => { setcurrent(current - 1) }} >上一步</Button>}
            </div>
        </div>
    )
}
