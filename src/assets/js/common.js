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