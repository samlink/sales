import { table_data, table_init, fetch_table } from '../parts/table.mjs';
import { fetch_tree, tree_init, tree_search } from '../parts/tree.mjs';
import { notifier } from '../parts/notifier.mjs';
import { alert_confirm } from '../parts/alert.mjs';
import { auto_table, AutoInput } from '../parts/autocomplete.mjs';
import * as service from '../parts/service.mjs'
import { SPLITER, getHeight, regInt, regReal, regDate, moneyUppercase } from '../parts/tools.mjs';

let get_height = getHeight() - 138;
let row_num = Math.floor(get_height / 30);

//执行日期实例------------------------------------------------
laydate.render({
    elem: '#search-date1',
    showBottom: false,
    theme: 'molv',
    // value: '2021-05-02'
    // theme: '#62468d',
});

laydate.render({
    elem: '#search-date2',
    showBottom: false,
    theme: 'molv',
});

//客户供应商自动填充--------------------------------------------
let cate = document.querySelector('#auto_cate');

let auto_comp = new AutoInput(document.querySelector('#search-customer'),
    cate, "/customer_auto", () => {
    });

auto_comp.init();

//填充表格空行-------------------------------------------------
let blank_rows = "";
for (let i = 0; i < row_num; i++) {
    blank_rows += blank_row_fn();
}

document.querySelector('.table-container tbody').innerHTML = blank_rows;

//表格搜索----------------------------------------------------
let init_data = {
    container: '.table-container',
    url: "/fetch_business",
    post_data: {
        id: "",
        name: '',
        sort: "单号 DESC",
        rec: row_num,
    },
    edit: false,
    header_names: {
        "日期": "日期",
        "单号": "单号",
        "类别": "documents.类别",
        "金额": "应结金额",
        "商品名称": "node_name",
        "规格型号": "规格型号",
        "单位": "单位",
        "价格": "单价",
        "数量": "abs(数量)",
        "备注": "documents.备注"
    },

    row_fn: row_fn,
    blank_row_fn: blank_row_fn,
};

document.querySelector('#serach-button').addEventListener('click', function () {
    let customer = document.querySelector('#search-customer').value;

    if (!customer) {
        notifier.show('客户供应商不能为空', 'danger');
        return;
    }

    let check_fields = document.querySelector('#checkbox-fields').checked;
    let check_date = document.querySelector('#checkbox-date').checked;

    let fields = check_fields ? document.querySelector('#search-fields').value : "";
    let date1 = check_date ? document.querySelector('#search-date1').value : "";
    let date2 = check_date ? document.querySelector('#search-date2').value : "";

    init_data.post_data.name = fields;
    init_data.post_data.cate = `${customer}${SPLITER}${date1}${SPLITER}${date2}`;

    table_init(init_data);
    fetch_table();

    
});


//查看单据
document.querySelector('#edit-button').addEventListener('click', function () {
    let chosed = document.querySelector('tbody .focus');
    let id = chosed ? chosed.querySelector('td:nth-child(3)').textContent : "";
    if (id != "") {
        let cate = chosed.querySelector('td:nth-child(4)').textContent;
        let address = "/sale/";

        if (cate.indexOf("采购") != -1) {
            address = "/buy_in/";
        }

        window.open(address + id);
    }
    else {
        notifier.show('请先选择单据', 'danger');
    }
});


function row_fn(tr) {
    let row = tr.split(SPLITER);
    let num = document.querySelector('#num_position').textContent.split(',');
    let center = "style='text-align:center'";
    let right = "style='text-align:right'";

    return `<tr><td ${center}>${row[0]}</td><td ${center}>${row[1]}</td><td>${row[2]}</td><td ${center}>${row[3]}</td>
            <td ${right}>${Number(row[4]).toFixed(num[1])}</td><td>${row[5]}</td><td>${row[6]}</td><td ${center}>${row[7]}</td>
            <td ${right}>${Number(row[8]).toFixed(num[0])}</td><td ${right}>${row[9]}</td><td>${row[10]}</td></tr>`;
}

function blank_row_fn() {
    return `<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`;
}