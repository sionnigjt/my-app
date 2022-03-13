import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { PageHeader, Descriptions } from 'antd';
import axios from 'axios'
import moment from 'moment'
export default function NewsPreview() {
    let params = useParams();
    //存数据
    const [previewInfo, setpreviewInfo] = useState(null)
    useEffect(() => {
        axios.get(`/ajax/news/${params.id}?_expand=category&_expand=role`).then(res => {
            setpreviewInfo(res.data)

        })
    }, [params.id])
    console.log(previewInfo);
    const AuditList = ["未审核", "待审核", "已通过", "未通过"]
    const publishList = ["未发布", "待发布", "已上线", "已下线"]
    return <div>
        {previewInfo && <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={previewInfo.title}
                subTitle={previewInfo.category.title}
            >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="创建者">{previewInfo.author}</Descriptions.Item>
                    <Descriptions.Item label="创建时间">{moment(previewInfo.createTime).format("YYYY/MM/DD")}</Descriptions.Item>
                    <Descriptions.Item label="发布时间">{previewInfo.publishTime}</Descriptions.Item>
                    <Descriptions.Item label="区域" >{previewInfo.region}</Descriptions.Item>
                    <Descriptions.Item label="审核状态" ><span style={{ color: "red" }}>{AuditList[previewInfo.auditState]}</span></Descriptions.Item>
                    <Descriptions.Item label="发布状态" ><span style={{ color: "red" }}>{publishList[previewInfo.pubilshState]}</span></Descriptions.Item>
                    <Descriptions.Item label="访问数量">{previewInfo.view}</Descriptions.Item>
                    <Descriptions.Item label="点击数量">{previewInfo.star}</Descriptions.Item>
                    <Descriptions.Item label="评论数量">0</Descriptions.Item>
                </Descriptions>
            </PageHeader>
            {/* 内嵌html,显示内容 */}
            <div dangerouslySetInnerHTML={{ __html: previewInfo.content }}
                style={{ margin: " 40px 24px", border: "1px solid gray" }}>

            </div>

        </div>}
    </div>;

}
