var cb_function;export var table_data={};export var table_init=function(data){if((table_data=Object.assign(data,{header:document.querySelector(data.container+" thead tr"),body:document.querySelector(data.container+" tbody"),page_input:document.querySelector(data.container+" #page-input"),page_first:document.querySelector(data.container+" #first"),page_pre:document.querySelector(data.container+" #pre"),page_aft:document.querySelector(data.container+" #aft"),page_last:document.querySelector(data.container+" #last"),total_pages:document.querySelector(data.container+" #pages"),total_records:document.querySelector(data.container+" #total-records"),other_info:document.querySelector(data.container+" #other-info")})).page_input.value=1,table_data.page_first.disabled=!0,table_data.page_pre.disabled=!0,table_data.post_data.page=1,table_data.page_pre.addEventListener("click",(e=>{table_data.edit||(table_data.page_input.value--,change_page(table_data.page_input.value))})),table_data.page_aft.addEventListener("click",(e=>{table_data.edit||(table_data.page_input.value++,change_page(table_data.page_input.value))})),table_data.page_first.addEventListener("click",(e=>{table_data.edit||change_page(1)})),table_data.page_last.addEventListener("click",(e=>{table_data.edit||change_page(table_data.total_pages.textContent)})),table_data.page_input.addEventListener("change",(function(){table_data.edit||change_page(table_data.page_input.value)})),table_data.header)for(let th of table_data.header.children)th.addEventListener("click",(function(e){if(!table_data.edit&&"序号"!=this.textContent){for(let t of table_data.header.children)t.textContent=t.textContent.split(" ")[0];let order=-1!==table_data.post_data.sort.indexOf("ASC")?"DESC":"ASC",arrow=-1!==table_data.post_data.sort.indexOf("ASC")?"▼":"▲",sort=table_data.header_names[this.textContent]+" "+order;this.textContent=this.textContent+" "+arrow,Object.assign(table_data.post_data,{page:1,sort:sort}),table_data.page_input.value=1,fetch_table(cb_function)}}))};export var fetch_table=function(cb){fetch(table_data.url,{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify(table_data.post_data)}).then((response=>response.json())).then((content=>{if(-1!=content){let rows="",count=0;for(let tr of content[0])rows+=table_data.row_fn(tr),count++;for(let i=0;i<table_data.post_data.rec-count;i++)rows+=table_data.blank_row_fn();table_data.body.innerHTML=rows,table_data.total_records.textContent=content[1],table_data.total_pages.textContent=content[2],table_data.page_input.value=table_data.post_data.page,table_data.other_info&&content[3]&&(table_data.other_info.textContent=content[3]),button_change(table_data.page_input,table_data.page_first,table_data.page_pre,table_data.page_aft,table_data.page_last,content[2]);for(let tr of table_data.body.children)tr.addEventListener("click",(function(e){if(!table_data.edit){for(let r of table_data.body.children)r.classList.remove("focus");this.classList.add("focus"),"function"==typeof table_data.row_click&&table_data.row_click(tr)}}));let links=table_data.body.querySelectorAll("a");if(links.length>0)for(let l of links)l.addEventListener("click",(function(e){e.stopPropagation()}));"function"==typeof cb&&(cb_function=cb,cb())}else alert("无此操作权限")}))};function change_page(value){table_data.page_input.value=value>Number(table_data.total_pages.textContent)?Number(table_data.total_pages.textContent):value<1?1:value,Object.assign(table_data.post_data,{page:Number(table_data.page_input.value)}),fetch_table(cb_function)}function button_change(input,first,pre,aft,last,pages){input.value<=1?(input.value=1,first.disabled=!0,pre.disabled=!0):(first.disabled=!1,pre.disabled=!1),input.value>=pages?(input.value=pages,last.disabled=!0,aft.disabled=!0):(last.disabled=!1,aft.disabled=!1)}