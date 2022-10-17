import {shareBaseUrl,doubanBaseUrl} from './httpConfig' // 基础路径
import service from './httpHelper' //封装的axios
export const getShareRss = (data) => {
    let url = `${shareBaseUrl}/topics/rss/rss.xml?`
    // console.log(data);
    let result = service({
        url: url,
        method: 'GET',
        params: data
    })
    return result;
}
export const getShareAdvancedSearch = () => service({
    url: `${shareBaseUrl}/topics/advanced-search?team_id=0&sort_id=0&orderby=`,
    method: 'GET',
})
// https://www.douban.com/search?q=摇曳露营
export const getDoubanSearch = (key) => service({
    url: `${doubanBaseUrl}/search?q=${key}`,
    method: 'GET',
})