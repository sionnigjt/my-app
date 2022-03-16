import React from 'react'
import usePublish from '../../../compents/Published/usePublish'
import NewsPublish from '../../../compents/Published/NewsPublish'
import { Button } from 'antd'
export default function Published() {
  //2:已发布的
  const { dataSource ,handleOff} = usePublish(2)
  return (
    <div><NewsPublish dataSource={dataSource} button={(id)=>< Button onClick={() => handleOff(id)}  danger >下线</Button>}></NewsPublish></div>
  )
}
