import { notifier } from '../parts/notifier.mjs';

var ctx = document.getElementById('myChart').getContext('2d');

var char_data = {
    data: {
        datasets: [{
            label: '销售额',
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    }
}

var myChart;

let statis_cate_s = localStorage.getItem("statis_cate");
let chart_cate_s = localStorage.getItem("chart_cate");

let statis_cate = statis_cate_s ? statis_cate_s : "按月";
let chart_cate = chart_cate_s ? chart_cate_s : "柱状图";

document.querySelector('#chart-cate').value = chart_cate;

if (statis_cate == "按月") {
    document.querySelector('#statis-cate').value = "按月";

    let data = {
        statis_cate: statis_cate,
        date1: date1,
        date2: date2,
    };

    set_chart(data);
}
else if (statis_cate == "按年") {
    document.querySelector('#statis-cate').value = "按年";
    document.querySelector('#search-date-month').style.display = "none";
    document.querySelector('#search-date-year').style.display = "inline-block";
    document.querySelector('#search-date-week').style.display = "none";

    info.textContent = y;

    let date = value_year.split(' - ');

    let data = {
        statis_cate: statis_cate,
        date1: date[0] + "-01-01",
        date2: date[1] + "-12-31",
    };

    set_chart(data);
}
else {
    if (statis_cate == "按周") {
        document.querySelector('#statis-cate').value = "按周";
        info.textContent = w;
    }
    else {
        document.querySelector('#statis-cate').value = "按日";
        info.textContent = d;
    }

    document.querySelector('#search-date-month').style.display = "none";
    document.querySelector('#search-date-year').style.display = "none";
    document.querySelector('#search-date-week').style.display = "inline-block";

    let date = value_week.split(' - ');

    let data = {
        statis_cate: statis_cate,
        date1: date[0],
        date2: date[1],
    };

    set_chart(data);
}

document.querySelector('#statis-cate').addEventListener('change', function () {
    if (this.value == "按月") {
        document.querySelector('#search-date-month').style.display = "inline-block";
        document.querySelector('#search-date-year').style.display = "none";
        document.querySelector('#search-date-week').style.display = "none";
        info.textContent = m;
    }
    else if (this.value == "按年") {
        document.querySelector('#search-date-month').style.display = "none";
        document.querySelector('#search-date-year').style.display = "inline-block";
        document.querySelector('#search-date-week').style.display = "none";
        info.textContent = y;
    }
    else {
        document.querySelector('#search-date-month').style.display = "none";
        document.querySelector('#search-date-year').style.display = "none";
        document.querySelector('#search-date-week').style.display = "inline-block";

        if (this.value == "按周") {
            info.textContent = w;
        }
        else {
            info.textContent = d;
        }
    }
});

document.querySelector('#chart-cate').addEventListener('change', function () {
    localStorage.setItem("chart_cate", this.value);
    char_data.type = this.value == "柱状图" ? "bar" : "line";
    char_data.data.datasets[0].fill = this.value == "柱状图" ? true : false;

    myChart.destroy();
    myChart = new Chart(ctx, char_data);
});

document.querySelector('#statis-button').addEventListener('click', function () {
    chart_cate = document.querySelector('#chart-cate').value;
    let sta_cate = document.querySelector('#statis-cate').value;

    let date, date1, date2;
    if (sta_cate == "按月") {
        date = document.querySelector('#search-date-month').value

        if (!date) {
            notifier.show('请输入起止月份', 'danger');
            return false;
        }

        date = date.split(' - ');
        date1 = date[0] + "-01";
        date2 = add_month(date[1]);
    }
    else if (sta_cate == "按年") {
        date = document.querySelector('#search-date-year').value;

        if (!date) {
            notifier.show('请输入起止年份', 'danger');
            return false;
        }

        date = date.split(' - ');
        date1 = date[0] + "-01-01";
        date2 = date[1] + "-12-31";
    }
    else {
        date = document.querySelector('#search-date-week').value;

        if (!date) {
            notifier.show('请输入正确日期', 'danger');
            return false;
        }

        date = date.split(' - ');
        date1 = date[0];
        date2 = date[1];
    }

    let data = {
        statis_cate: sta_cate,
        date1: date1,
        date2: date2,
    };

    set_chart(data);

    localStorage.setItem("statis_cate", sta_cate);
});

function set_chart(data) {
    fetch("/fetch_statis", {
        method: 'post',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(content => {
            if (content != -1) {
                let th_date = document.querySelector('#th-date');

                if (data.statis_cate == "按月") {
                    th_date.textContent = "月份";
                }
                else if (data.statis_cate == "按年") {
                    th_date.textContent = "年份";
                }
                else if (data.statis_cate == "按周") {
                    th_date.textContent = "周 (周一)";
                }
                else {
                    th_date.textContent = "日期";
                }

                let rows = "";
                for (let i = 0; i < content[0].length; i++) {
                    rows += `<tr><td>${content[0][i]}</td><td>${content[1][i]}</td><td>${content[2][i]}</td></tr>`;
                }

                document.querySelector('.table-container tbody').innerHTML = rows;

                char_data.type = chart_cate == "柱状图" ? "bar" : "line";
                char_data.data.labels = content[1];
                char_data.data.datasets[0].data = content[2];
                char_data.data.datasets[0].fill = chart_cate == "柱状图" ? true : false;

                if (myChart) {
                    myChart.destroy();
                }

                myChart = new Chart(ctx, char_data);
            }
            else {
                notifier.show('无操作权限', 'danger');
            }
        });
}

function add_month(da_str) {
    let str = da_str + "-01";
    str = str.replace(/-/g, '/');
    let date = new Date(str);

    date.setMonth(date.getMonth() + 1);
    return new Intl.DateTimeFormat('fr-CA').format(date);
}