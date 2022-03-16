import { useEffect, useState } from 'react'
import axios from 'axios'
import { notification } from 'antd'
function usePublish(id) {
    const [dataSource, setdataSource] = useState([])
    const { username } = JSON.parse(localStorage.getItem('token'))
    useEffect(() => {
        axios.get(`/ajax/news?author=${username}&pubilshState=${id}&_expand=category`).then(res => {
            // console.log(res.data);
            setdataSource(res.data
            )
        })
    }, [username, id])
    const filterData = (id) => {
        setdataSource(dataSource.filter(value => value.id !== id))
    }
    const patchData = (id, state) => {
        axios.patch(`/ajax/news/${id}`, {
            'pubilshState': state
        }).then(res => {
            notification.info({
                message: `通知`,
                description:
                    `已发布`,
                placement: "bottomRight"
            });
        })
    }
    function handlePublished(id) {
        filterData(id)
        patchData(id, 2)

    }
    function handleDelete(id) {
        filterData(id)
        axios.delete(`/ajax/news/${id}`)
    }
    function handleOff(id) {
        filterData(id)
        patchData(id, 3)

    }
    return {
        dataSource,
        handlePublished,
        handleDelete,
        handleOff

    }
}
export default usePublish