import { table_data, table_init, fetch_table } from '../parts/table.mjs';
import { notifier } from '../parts/notifier.mjs';
import { alert_confirm } from '../parts/alert.mjs';
import { autocomplete } from '../parts/autocomplete.mjs';
import { regInt, regReal, getHeight, SPLITER, download_file, checkFileType } from '../parts/tools.mjs';
import * as service from '../parts/service.mjs';

let global = {
    row_id: 0,
    edit: 0,
    eidt_cate: "",
}

let table_top = document.querySelector('.table-top').clientHeight;
let table_head = document.querySelector('table thead').clientHeight;

let get_height = getHeight(table_top, table_head) - 35;

let ctrl_height = document.querySelector('.table-ctrl').clientHeight;
let row_num = Math.floor((get_height - ctrl_height) / 30);

let table_name = {
    name: "客户"
};

let table_fields;
let header_names = {};

let init_data = {
    container: '.table-customer',
    header_names: header_names,
    url: "/fetch_customer",
    post_data: {
        id: "",
        name: '',
        sort: "名称 ASC",
        rec: row_num,
    },
    edit: false,

    row_fn: table_row,
    blank_row_fn: blank_row,
};

fetch("/fetch_fields", {
    method: 'post',
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(table_name),
})
    .then(response => response.json())
    .then(content => {
        if (content != -1) {
            table_fields = content[0].filter((item) => {
                return item.is_show;
            });

            let all_width = 0;
            for (let item of table_fields) {
                all_width += item.show_width;
            }

            all_width += 3;  //序号列的宽度
            let table_width = document.querySelector('.table-customer').clientWidth;
            let width = table_width / all_width;
            let rows = `<th width='${300 / all_width}%'>序号</th><th hidden>编号</th>`;

            if (width < 18) {
                rows = `<th width='${3 * 18}px'>序号</th><th hidden>编号</th>`;
                document.querySelector('.table-customer').style.width = table_width;
                document.querySelector('.table-customer .table-ctrl').style.cssText = `
                position: absolute;
                width: ${table_width + 2}px;
                margin-top: 11px;
                border: 1px solid #edf5fb;
                margin-left: -2px;`;
            }

            for (let th of table_fields) {
                rows += width > 18 ? `<th width="${(th.show_width * 100 / all_width).toFixed(1)}%">${th.show_name}</th>` :
                    `<th width="${th.show_width * 18}px">${th.show_name}</th>`;

                let key = th.show_name;
                let value = th.field_name;
                header_names[key] = value;
            }
            document.querySelector('.table-customer thead tr').innerHTML = rows;

            table_init(init_data);
            fetch_table();
        }
    });

function table_row(tr) {
    return service.build_row_from_string(tr, table_fields);
}

function blank_row() {
    return service.build_blank_from_fields(table_fields);
}

//搜索规格
let search_input = document.querySelector('#search-input');

autocomplete(search_input, "", "/customer_auto", () => {
    search_table();
});

document.querySelector('#serach-button').addEventListener('click', function () {
    search_table();
});

function search_table() {
    let search = document.querySelector('#search-input').value;
    Object.assign(table_data.post_data, { name: search, page: 1 });
    fetch_table();
}

//增加按键
document.querySelector('#add-button').addEventListener('click', function () {
    global.eidt_cate = "add";

    document.querySelector('.modal-body').innerHTML = service.build_add_form(table_fields);

    document.querySelector('.modal-title').textContent = "增加客户";
    document.querySelector('.modal-dialog').style.cssText = "max-width: 500px;"

    document.querySelector('#customer-modal').style.display = "block";
    document.querySelector('.modal-body input').focus();
    leave_alert();
});

//编辑按键
document.querySelector('#edit-button').addEventListener('click', function () {
    global.eidt_cate = "edit";

    let chosed = document.querySelector('tbody .focus');
    let id = chosed ? chosed.querySelector('td:nth-child(2)').textContent : "";
    if (id != "") {
        global.row_id = id;

        document.querySelector('.modal-body').innerHTML = service.build_edit_form(table_fields, chosed);

        document.querySelector('.modal-title').textContent = "编辑客户";
        document.querySelector('.modal-dialog').style.cssText = "max-width: 500px;"
        document.querySelector('#customer-modal').style.display = "block";
        document.querySelector('.modal-body input').focus();
        leave_alert();
    }
    else {
        notifier.show('请先选择客户', 'danger');
    }
});

//提交按键
document.querySelector('#modal-sumit-button').addEventListener('click', function () {
    if (global.eidt_cate == "add" || global.eidt_cate == "edit") {
        let all_input = document.querySelectorAll('.has-value');
        let num = 0;
        for (let input of all_input) {
            if (table_fields[num].data_type == "整数" && !regInt.test(input.value)
                || table_fields[num].data_type == "实数" && !regReal.test(input.value)) {
                notifier.show('数字字段输入错误', 'danger');
                return false;
            }
            num++;
        }
        let customer = `${global.row_id}${SPLITER}${global.row_id}${SPLITER}`;

        num = 0;

        for (let input of all_input) {
            let value;
            if (input.parentNode.className.indexOf('check-radio') == -1) {
                value = input.value;
            }
            else {
                value = input.checked;
            }

            customer += `${value}${SPLITER}`;
            num++;
        }

        let data = {
            data: customer,
        };

        let url = global.eidt_cate == "edit" ? "/update_customer" : "/add_customer";

        fetch(url, {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(content => {
                if (content == 1) {
                    global.edit = 0;
                    notifier.show('客户修改成功', 'success');
                    fetch_table();
                }
                else {
                    notifier.show('权限不够，操作失败', 'danger');
                }
            });
    }
    else {
        let url = global.eidt_cate == "批量导入" ? "/customer_addin" : "/customer_updatein";
        fetch(url, {
            method: 'post',
        })
            .then(response => response.json())
            .then(content => {
                if (content == 1) {
                    notifier.show('批量操作成功', 'success');
                    close_modal();
                }
                else {
                    notifier.show('权限不够，操作失败', 'danger');
                }
            });
    }
});

//关闭按键
document.querySelector('#modal-close-button').addEventListener('click', function () {
    close_modal();
});

//关闭按键
document.querySelector('.top-close').addEventListener('click', function () {
    close_modal();
});

//关闭函数
function close_modal() {
    if (global.edit == 1) {
        alert_confirm('编辑还未保存，确认退出吗？', {
            confirmCallBack: () => {
                global.edit = 0;
                document.querySelector('#customer-modal').style.display = "none";
            }
        });
    } else {
        document.querySelector('#customer-modal').style.display = "none";
    }

    document.querySelector('#modal-info').innerHTML = "";
}

//编辑离开提醒事件
function leave_alert() {
    let all_input = document.querySelectorAll('#customer-modal input');
    for (let input of all_input) {
        input.addEventListener('input', () => {
            global.edit = 1;
        });
    }

    let all_select = document.querySelectorAll('#customer-modal select');
    for (let select of all_select) {
        select.addEventListener('change', function () {
            global.edit = 1;
        });
    }
}

//数据导入和导出 ------------------------------------------------------------------------------

document.querySelector('#data-out').addEventListener('click', function () {
    fetch("/customer_out", {
        method: 'post',
    })
        .then(response => response.json())
        .then(content => {
            if (content != -1) {
                download_file(`/download/${content}.xlsx`);
                notifier.show('成功导出至 Excel 文件', 'success');
            }
            else {
                notifier.show('权限不够，操作失败', 'danger');
            }
        });
});

//批量导入
let fileBtn = document.getElementById('choose_file');

document.getElementById('data-in').addEventListener('click', function () {
    fileBtn.click();
});

fileBtn.addEventListener('change', () => {
    data_in(fileBtn, "将追加", "追加新数据，同时保留原数据", "批量导入");
});

//批量更新
let fileBtn_update = document.getElementById('choose_file2');

document.getElementById('data-update').addEventListener('click', function () {
    fileBtn_update.click();
});

fileBtn_update.addEventListener('change', () => {
    data_in(fileBtn_update, "将更新", "更新数据，原数据将被替换，请谨慎操作！", "批量更新");
});

function data_in(fileBtn, info1, info2, cate) {
    if (checkFileType(fileBtn)) {
        const fd = new FormData();
        fd.append('file', fileBtn.files[0]);
        fetch('/customer_in', {
            method: 'POST',
            body: fd,
        })
            .then(res => res.json())
            .then(content => {
                if (content != -1 && content != -2) {
                    let rows = "<div class='table-container table-customer'><table style='font-size: 12px;'><thead>"
                    let n = 1;
                    for (let item of content[0]) {
                        let arr_p = item.split(SPLITER);
                        let row = `<tr>`;
                        if (n == 1) {
                            for (let i = 0; i < arr_p.length - 1; i++) {
                                row += `<th>${arr_p[i]}</th}>`;
                            }
                            row += "</tr></thead><tbody>";
                            n = 2;
                        } else {
                            for (let i = 0; i < arr_p.length - 1; i++) {
                                row += `<td>${arr_p[i]}</td>`;
                            }
                            row += "</tr>";
                        }

                        rows += row;
                    }
                    rows += "</tbody></table></div>";
                    document.querySelector('.modal-body').innerHTML = rows;

                    let message = content[1] > 50 ? " (仅显示前 50 条）" : "";
                    document.querySelector('.modal-title').innerHTML = `客户信息${info1} ${content[1]} 条数据${message}：`;
                    document.querySelector('#modal-info').innerHTML = `客户信息${info2}`;

                    global.eidt_cate = cate;

                    document.querySelector('.modal-dialog').style.cssText = "max-width: 1200px;"
                    document.querySelector('#customer-modal').style.cssText = "display: block";
                    fileBtn.value = "";

                } else if (content == -1) {
                    notifier.show('缺少操作权限', 'danger');
                } else {
                    notifier.show('excel 表列数不符合', 'danger');
                }
            });
    }
    else {
        notifier.show('需要 excel 文件', 'danger');
    }
}
