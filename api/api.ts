
import axios from 'axios'

const jvcApi = axios.create({
    baseURL: '/api'
})

export default jvcApi;