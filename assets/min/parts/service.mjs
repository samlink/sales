import{SPLITER}from"../parts/tools.mjs";import{AutoInput}from"../parts/autocomplete.mjs";import{table_data,table_init,fetch_table}from"../parts/table.mjs";export var table_fields;export function build_table_header(table_container,custom_fields,table_fields,last_fields){let all_width=0;for(let item of custom_fields)all_width+=item.width;if(last_fields)for(let item of last_fields)all_width+=item.width;for(let item of table_fields)all_width+=item.show_width;let table_width=table_container.clientWidth,width_raio=table_width/all_width,row="";if(width_raio<18){for(let item of custom_fields)row+=`<th width='${18*item.width}px'>${item.name}</th>`;table_container.style.width=table_width,table_container.querySelector(".table-ctrl").style.cssText=`\n            position: absolute;\n            width: ${table_width+2}px;\n            margin-top: 11px;\n            border: 1px solid #edf5fb;\n            margin-left: -2px;`}else for(let item of custom_fields)row+=`<th width='${100*item.width/all_width}%'>${item.name}</th>`;let header_names={};for(let th of custom_fields){header_names[th.name]=th.field}for(let th of table_fields){row+=width_raio>18?`<th width="${(100*th.show_width/all_width).toFixed(1)}%">${th.show_name}</th>`:`<th width="${18*th.show_width}px">${th.show_name}</th>`,header_names[th.show_name]=th.field_name}if(last_fields)for(let item of last_fields){row+=width_raio<18?`<th width='${18*item.width}px'>${item.name}</th>`:`<th width='${100*item.width/all_width}%'>${item.name}</th>`,header_names[item.name]=item.field}return{th_row:row,header_names:header_names}}export function build_row_from_string(rec,row,table_fields,n){n||(n=2);for(let name of table_fields)"文本"==name.data_type?row+=`<td  title='${rec[n]}'>${rec[n]}</td>`:"整数"==name.data_type||"实数"==name.data_type?row+=`<td style="text-align: right;">${rec[n]}</td>`:row+=`<td style="text-align: center;">${rec[n]}</td>`,n++;return row+="</tr>"}export function build_blank_from_fields(row,table_fields){for(let _f of table_fields)row+="<td></td>";return row+="</tr>"}export function build_edit_form(num,table_fields,chosed){let form="<form>";for(let name of table_fields){let control;if("普通输入"==name.ctr_type){let value=chosed.querySelector(`td:nth-child(${num})`).textContent;control=`<div class="form-group">\n                            <div class="form-label">\n                                <label>${name.show_name}</label>\n                            </div>\n                            <input class="form-control input-sm has-value" type="text" value="${value}">\n                        </div>`}else if("二值选一"==name.ctr_type){let check=chosed.querySelector(`td:nth-child(${num})`).textContent==name.option_value.split("_")[0]?"checked":"";control=`<div class="form-group">\n                            <div class="form-label">                                    \n                                <label>${name.show_name}</label>\n                            </div>\n                            <label class="check-radio"><input class="has-value" type="checkbox" ${check}><span class="checkmark"></span>\n                            </label>\n                        </div>`}else{let show_value=chosed.querySelector(`td:nth-child(${num})`).textContent;control=`<div class="form-group">\n                            <div class="form-label">                                    \n                                <label>${name.show_name}</label>\n                            </div>\n                            <select class='select-sm has-value'>`;let options=name.option_value.split("_");for(let value of options)control+=value==show_value?`<option value="${value}" selected>${value}</option>`:`<option value="${value}">${value}</option>`;control+="</select></div>"}form+=control,num++}return form+="</form>",form}export function build_add_form(table_fields){let form="<form>";for(let name of table_fields){let control;if("普通输入"==name.ctr_type)control=`<div class="form-group">\n                                <div class="form-label">\n                                    <label>${name.show_name}</label>\n                                </div>\n                                <input class="form-control input-sm has-value" type="text">\n                            </div>`;else if("二值选一"==name.ctr_type){let checked=name.option_value.split("_")[0]==name.default_value?"checked":"";control=`<div class="form-group">\n                                <div class="form-label">                                    \n                                    <label>${name.show_name}</label>\n                                </div>\n                                <label class="check-radio">\n                                    <input class="has-value" type="checkbox" ${checked}>\n                                    <span class="checkmark"></span>\n                                </label>\n                            </div>`}else{control=`<div class="form-group">\n                                <div class="form-label">                                    \n                                    <label>${name.show_name}</label>\n                                </div>\n                                <select class='select-sm has-value'>`;let options=name.option_value.split("_");for(let value of options){control+=`<option value="${value}" ${value==name.default_value?"selected":""}>${value}</option>`}control+="</select></div>"}form+=control}return form+="</form>",form}export function build_inout_form(table_fields,data){let values=data?data.split(SPLITER):"",form="",n=0;for(let name of table_fields){let control,id=name.all_edit?"":`id="${name.field_name}"`,value=values?values[n]:"";if("普通输入"==name.ctr_type)value="0"===value?"":value,control=`<div class="form-group">\n                                <div class="form-label">\n                                    <label>${name.show_name}</label>\n                                </div>\n                                <div class="form-input">\n                                    <input class="form-control input-sm document-value" value='${value}' type="text" ${id}\n                                        style="width: ${20*name.show_width}px;" />\n                                </div>\n                            </div>`;else if("二值选一"==name.ctr_type){let has_value=value||name.default_value,checked=name.option_value.split("_")[0]==has_value?"checked":"";control=`<div class="form-group">\n                                <div class="form-label">                                    \n                                    <label class='check-label' for='${name.show_name}'>${name.show_name}</label>\n                                </div>\n                                <label class="check-radio">\n                                    <input class="document-value" id='${name.show_name}' type="checkbox" ${id} ${checked}>\n                                    <span class="checkmark"></span>\n                                </label>\n                            </div>`}else{control=`<div class="form-group">\n                                <div class="form-label">                                    \n                                    <label>${name.show_name}</label>\n                                </div>\n                                <select class='select-sm document-value' style="width: ${20*name.show_width}px;" ${id}>`;let options=name.option_value.split("_"),has_value=value||name.default_value;for(let value of options){control+=`<option value="${value}" ${value==has_value?"selected":""}>${value}</option>`}control+="</select></div>"}form+=control,n++}return form}export function build_product_table(row_num,cb){let init_data={container:".table-product",url:`/${code}/fetch_blank`,post_data:{id:"",name:"",sort:"规格型号 ASC",rec:row_num,cate:""},edit:!1,row_fn:function(tr){let rec=tr.split(SPLITER),row=`<tr><td style="text-align: center;">${rec[1]}</td><td hidden>${rec[0]}</td>`;return build_row_from_string(rec,row,table_fields).replace("</tr>",`<td>${rec[rec.length-2]}</td></tr>`)},blank_row_fn:function(){return build_blank_from_fields("<tr><td></td><td></td>",table_fields)}};fetch(`/${code}/fetch_fields`,{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:"商品规格"})}).then((response=>response.json())).then((content=>{if(-1!=content){table_fields=content[0].filter((item=>item.is_show));let table=document.querySelector(".table-product"),header=build_table_header(table,[{name:"序号",width:3}],table_fields,[{name:"库存",field:"库存",width:3}]);table.querySelector("thead tr").innerHTML=header.th_row,init_data.header_names=header.header_names,init_data.header_names["编号"]="id",table_init(init_data),fetch_table();let data={url:`/${code}/fetch_product`},post_data={page:1};Object.assign(table_data,data),Object.assign(table_data.post_data,post_data)}}));let search_input=document.querySelector("#search-input"),cate=document.querySelector("#product-id");function search_table(){let search=document.querySelector("#search-input").value;if(Object.assign(table_data.post_data,{name:search,page:1}),"function"==typeof cb){let table=document.querySelector(".table-product");fetch_table((()=>{cb(table)}))}else fetch_table()}new AutoInput(search_input,cate,`/${code}/product_auto`,(()=>{search_table()})).init(),document.querySelector("#serach-button").addEventListener("click",(function(){search_table()}))}