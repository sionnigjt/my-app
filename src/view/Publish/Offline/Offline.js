import React from 'react'
import usePublish from '../../../compents/Published/usePublish'
import NewsPublish from '../../../compents/Published/NewsPublish'
import { Button } from 'antd'
export default function Offline() {
  const { dataSource ,handleDelete} = usePublish(3)
  return (
    <div><NewsPublish dataSource={dataSource} button={(id)=><Button danger onClick={()=>handleDelete(id)}>删除</Button>} ></NewsPublish></div>
  )
}
