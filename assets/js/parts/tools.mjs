export var SPLITER = '<`*_*`>';
export var regInt = /^[+]{0,1}(\d+)$/;
export var regReal = /^\d+(\.\d+)?$/;
export var regDate = /^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;

//左侧补零
export function padZero(num, length) {
    return (Array(length).join('0') + num).slice(-length);
}

//获得控件的高度
export function getHeight() {
    // let header = document.querySelector('.header');
    // let footer = document.querySelector('footer');
    // let title = document.querySelector('.top-title');

    let content_height = document.body.clientHeight - 138;  //138 是 header，footer 和 top-title 的高度和
    var sum = 0;
    for (let i = 0; i < arguments.length; i++) {
        sum += arguments[i];
    }
    return content_height - sum;
}

//下载文件，url 是下载地址
export function download_file(url) {
    var downloadLink = document.createElement("a");
    downloadLink.href = url;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

//检查上传文件类型，input 是输入控件
export function checkFileType(input) {
    var acceptType = input.getAttribute('accept');
    var selectedFile = input.value;
    var fileType = selectedFile.substring(selectedFile.indexOf('.') + 1, selectedFile.length);
    var location = acceptType.indexOf(fileType);
    if (location > -1) {
        return true;
    } else {
        return false;
    }
}

//金额转中文大写
export function moneyUppercase(n) {
    var fraction = ['角', '分'];
    var digit = [
        '零', '壹', '贰', '叁', '肆',
        '伍', '陆', '柒', '捌', '玖'
    ];
    var unit = [
        ['元', '万', '亿'],
        ['', '拾', '佰', '仟']
    ];
    var head = n < 0 ? '欠' : '';
    n = Math.abs(n);
    var s = '';
    for (var i = 0; i < fraction.length; i++) {
        s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
    }
    s = s || '整';
    n = Math.floor(n);
    for (var i = 0; i < unit[0].length && n > 0; i++) {
        var p = '';
        for (var j = 0; j < unit[1].length && n > 0; j++) {
            p = digit[n % 10] + unit[1][j] + p;
            n = Math.floor(n / 10);
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
    }
    return head + s.replace(/(零.)*零元/, '元')
        .replace(/(零.)+/g, '零')
        .replace(/^整$/, '零元整');
};