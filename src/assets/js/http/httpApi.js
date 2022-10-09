import config from './httpConfig' // 基础路径
import service from './httpHelper' //封装的axios

export const getList = () => service({
    url: `${config.rssBaseUrl}/latest`,
    method: 'GET',
})


export const getTagBangumi = () => service({
    url: `${config.apiBaseUrl}/tag/popbangumi`,
    method: 'POST',
})

export const getTeam = () => service({
    url: `${config.apiBaseUrl}/tag/team`,
    method: 'POST',
})


export const getKey = (data) => service({
    url: `${config.apiBaseUrl}/torrent/search`,
    method: 'POST',
    data: data
})