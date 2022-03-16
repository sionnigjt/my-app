import React from 'react'
import usePublish from '../../../compents/Published/usePublish'
import NewsPublish from '../../../compents/Published/NewsPublish'
import { Button } from 'antd'
export default function Unpublished() {
    //自定义hook
    const { dataSource ,handlePublished} = usePublish(1)
    return (
        <div><NewsPublish dataSource={dataSource} button={(id) => <Button onClick={() => handlePublished(id)} type='primary'>发布</Button>}></NewsPublish></div>
    )
}
