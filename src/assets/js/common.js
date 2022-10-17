import {ElMessage} from "element-plus";

export const convertUTCTimeToLocalTime = (UTCDateString) => {
    if (!UTCDateString) {
        return '-';
    }

    function formatFunc(str) {    //格式化显示
        return str > 9 ? str : '0' + str
    }

    let date2 = new Date(UTCDateString);     //这步是关键
    let year = date2.getFullYear();
    let mon = formatFunc(date2.getMonth() + 1);
    let day = formatFunc(date2.getDate());
    let hour = date2.getHours();
    let min = formatFunc(date2.getMinutes());
    let dateStr = year + '-' + mon + '-' + day + ' ' + hour + ':' + min;
    return dateStr;
};

// 获取高级分类
export const getShareAdvancedSearch = async () => {
    let typeList = await handleData.getData('typeList');
    let teamList = await handleData.getData('teamList');
    if (!typeList || !teamList) {
        window.getHttp.getShareAdvancedSearch().then(data => {
            let div = document.createElement("div");
            div.innerHTML = data.data;
            typeList = [];
            for (let i = 0; i < div.querySelector("#AdvSearchSort").children.length; i++) {
                let child = div.querySelector("#AdvSearchSort").children[i];
                typeList.push({
                    label: child.text,
                    id: child.value
                })
            }
            handleData.saveData('typeList', typeList, 'array')

            teamList = [];
            for (let i = 0; i < div.querySelector("#AdvSearchTeam").children.length; i++) {
                let child = div.querySelector("#AdvSearchTeam").children[i];
                teamList.push({
                    label: child.text,
                    id: child.value
                })
            }
            handleData.saveData('teamList', teamList, 'array')
            return {typeList, teamList}
        })
    } else {
        return {typeList, teamList}
    }
};

export const handleData = {
    async saveData(key, data) {
        return window.handleData.saveData({key, value: JSON.parse(JSON.stringify(data))});
    },
    getData(key) {
        return window.handleData.getData(key);
    },
    removeData(key) {
        return window.handleData.removeData(key);
    }
}
