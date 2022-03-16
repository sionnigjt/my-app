import React from 'react'
import { Table } from 'antd'
import { Link } from 'react-router-dom';
export default function NewsPublish(props) {
    // const { confirm } = Modal;

    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title, item) => {
                return <Link to={`/news-manage/preview/${item.id}`}>{title}</Link>
            },
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            render: (category) => {
                return category.title
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
            render: (author) => {
                return author
            }
        }, {
            title: '操作',
            render: (item) => {
                return <div >
                    {props.button(item.id)}
                </div>
            }
        }
    ];
    // console.log(dataSource);
    return (
        <div>
            <Table dataSource={props.dataSource} columns={columns} pagination={{
                pageSize: 5
            }} rowKey={(item) => item.id} />

        </div>
    )
}
