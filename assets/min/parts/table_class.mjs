export class MakeTable{constructor(table_data,cb){this.table_data=table_data,this.cb_function=cb}init(){let this_table=this,table_data=this.table_data;if(table_data.page_input.value=1,table_data.page_first.disabled=!0,table_data.page_pre.disabled=!0,table_data.post_data.page=1,table_data.page_pre.addEventListener("click",(e=>{table_data.edit||(table_data.page_input.value--,change_page(table_data.page_input.value))})),table_data.page_aft.addEventListener("click",(e=>{table_data.edit||(table_data.page_input.value++,change_page(table_data.page_input.value))})),table_data.page_first.addEventListener("click",(e=>{table_data.edit||change_page(1)})),table_data.page_last.addEventListener("click",(e=>{table_data.edit||change_page(table_data.total_pages.textContent)})),table_data.page_input.addEventListener("change",(function(){table_data.edit||change_page(table_data.page_input.value)})),table_data.header)for(let th of table_data.header.children)th.addEventListener("click",(function(e){if(!table_data.edit&&"序号"!=th.textContent){for(let t of table_data.header.children)t.textContent=t.textContent.split(" ")[0];let order=-1!==table_data.post_data.sort.indexOf("ASC")?"DESC":"ASC",arrow=-1!==table_data.post_data.sort.indexOf("ASC")?"▼":"▲",sort=table_data.header_names[this.textContent]+" "+order;this.textContent=this.textContent+" "+arrow,Object.assign(table_data.post_data,{page:1,sort:sort}),table_data.page_input.value=1,this_table.fetch_table()}}));function change_page(value){table_data.page_input.value=value>Number(table_data.total_pages.textContent)?Number(table_data.total_pages.textContent):value<1?1:value,Object.assign(table_data.post_data,{page:Number(table_data.page_input.value)}),this_table.fetch_table()}}change_data(data){Object.assign(this.table_data.post_data,data)}fetch_table(){let table_data=this.table_data;fetch(table_data.url,{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify(table_data.post_data)}).then((response=>response.json())).then((content=>{if(-1!=content){let rows="",count=0;for(let tr of content[0])rows+=table_data.row_fn(tr),count++;for(let i=0;i<table_data.post_data.rec-count;i++)rows+=table_data.blank_row_fn();table_data.body.innerHTML=rows,table_data.total_records.textContent=content[1],table_data.total_pages.textContent=content[2],table_data.page_input.value=table_data.post_data.page,function(input,first,pre,aft,last,pages){input.value<=1?(input.value=1,first.disabled=!0,pre.disabled=!0):(first.disabled=!1,pre.disabled=!1);input.value>=pages?(input.value=pages,last.disabled=!0,aft.disabled=!0):(last.disabled=!1,aft.disabled=!1)}(table_data.page_input,table_data.page_first,table_data.page_pre,table_data.page_aft,table_data.page_last,content[2]);for(let tr of table_data.body.children)tr.addEventListener("click",(function(e){if(!table_data.edit){for(let r of table_data.body.children)r.classList.remove("focus");this.classList.add("focus"),"function"==typeof table_data.row_click&&table_data.row_click(tr)}}));let links=table_data.body.querySelectorAll("a");if(links.length>0)for(let l of links)l.addEventListener("click",(function(e){e.stopPropagation()}));!function(){var tTD,table=table_data.table;for(let j=0;j<table.rows[0].cells.length;j++)table.rows[0].cells[j].onmousedown=function(event){tTD=this,event.offsetX>tTD.offsetWidth-10&&(tTD.mouseDown=!0,tTD.oldX=event.x,tTD.oldWidth=tTD.offsetWidth)},table.rows[0].cells[j].onmouseup=function(event){null==tTD&&(tTD=this),tTD.mouseDown=!1,tTD.style.cursor="pointer"},table.rows[0].cells[j].onmousemove=function(event){if(event.offsetX>this.offsetWidth-10?this.style.cursor="col-resize":this.style.cursor="pointer",null==tTD&&(tTD=this),null!=tTD.mouseDown&&1==tTD.mouseDown){for(tTD.style.cursor="pointer",tTD.oldWidth+(event.x-tTD.oldX)>0&&(tTD.width=tTD.oldWidth+(event.x-tTD.oldX)),tTD.style.width=tTD.width,tTD.style.cursor="col-resize",table=tTD;"TABLE"!=table.tagName;)table=table.parentElement;for(j=0;j<table.rows.length;j++)table.rows[j].cells[tTD.cellIndex].width=tTD.width}}}(),"function"==typeof this.cb_function&&this.cb_function()}else alert("无此操作权限")}))}}