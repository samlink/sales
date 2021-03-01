import{notifier}from"../parts/notifier.mjs";import{AutoInput}from"../parts/autocomplete.mjs";import{SPLITER}from"../parts/tools.mjs";document.querySelector("#customers .nav-icon").classList.add("show-chosed"),document.querySelector("#customers .menu-text").classList.add("show-chosed");let p=document.querySelector("#num_position").textContent.split(",")[1];laydate.render({elem:"#search-date1",showBottom:!1}),laydate.render({elem:"#search-date2",showBottom:!1});let cate=document.querySelector("#auto_cate"),auto_comp=new AutoInput(document.querySelector("#search-customer"),cate,`/${code}/customer_auto`,(()=>{}));auto_comp.init();let old_date1,old_date2,flag=0;document.querySelector("#customer-cate").addEventListener("change",(function(){flag=0}));let search_button=document.querySelector("#serach-button");function clear_table(){document.querySelector(".table-container tbody").innerHTML="<tr><td>商品采购</td><td></td><td></td><td></td><td></td><td></td>\n               <tr><td>采购退货</td><td></td><td></td><td></td><td></td><td></td>\n               <tr><td>小计</td><td></td><td></td><td></td><td></td><td></td>\n               <tr><td>商品销售</td><td></td><td></td><td></td><td></td><td></td>\n               <tr><td>商品退货</td><td></td><td></td><td></td><td></td><td></td>\n               <tr><td>小计</td><td></td><td></td><td></td><td></td><td></td>"}search_button.addEventListener("click",(function(){clear_table();let date1=document.querySelector("#search-date1").value,date2=document.querySelector("#search-date2").value;if(!date1||!date2)return void notifier.show("请输入起止日期","danger");old_date1==date1&&old_date2==date2||(old_date1=date1,old_date2=date2,flag=0);let cate=document.querySelector("#customer-cate").value,c=document.querySelector("#search-customer").value,customer=c||"",data={cate:cate,customer:customer,date1:date1,date2:date2};fetch(`/${code}/fetch_debt`,{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)}).then((response=>response.json())).then((content=>{if(-1!=content){if(document.querySelector(".customer-name").textContent=customer,0==flag){flag=1;let div_list=document.querySelector(".name-list"),names="";for(let name of content[0])names+=`<p>${name}</p>`;div_list.innerHTML=names;let ps=div_list.querySelectorAll("p");for(let p of ps)p.addEventListener("click",(function(){for(let p1 of ps)p1.classList.remove("focus");this.classList.add("focus"),document.querySelector("#search-customer").value=p.textContent,search_button.click()}))}if(content[1].length>0){let rows="",debt1=content[1][0].split(SPLITER),debt2=content[1][1].split(SPLITER),debt3=content[1][2].split(SPLITER),debt4=content[1][3].split(SPLITER),s1=0,s2=0,s3=0,s4=0,s5=0,row="<tr>";for(let d of debt1)d=0==d?"":d,row+=`<td>${d}</td>`;row+="</tr>",rows+=row,row="<tr>";for(let d of debt2)d=0==d?"":d,row+=`<td>${d}</td>`;row+="</tr>",rows+=row,s1=1*debt1[1]+1*debt2[1],s2=1*debt1[2]-1*debt2[2],s3=1*debt1[3]-1*debt2[3],s4=1*debt1[4]-1*debt2[4],s5=1*debt1[5]-1*debt2[5],rows+=`<tr><td>小计</td><td>${0==s1?"":s1}</td><td>${0==s2?"":s2.toFixed(p)}</td><td>${0==s3?"":s3.toFixed(p)}</td>\n                    <td>${0==s4?"":s4.toFixed(p)}</td><td>${0==s5?"":s5.toFixed(p)}</td></tr>`,s1=0,s2=0,s3=0,s4=0,s5=0,row="<tr>";for(let d of debt3)d=0==d?"":d,row+=`<td>${d}</td>`;row+="</tr>",rows+=row,row="<tr>";for(let d of debt4)d=0==d?"":d,row+=`<td>${d}</td>`;row+="</tr>",rows+=row,s1=1*debt3[1]+1*debt4[1],s2=1*debt3[2]-1*debt4[2],s3=1*debt3[3]-1*debt4[3],s4=1*debt3[4]-1*debt4[4],s5=1*debt3[5]-1*debt4[5],rows+=`<tr><td>小计</td><td>${0==s1?"":s1}</td><td>${0==s2?"":s2.toFixed(p)}</td><td>${0==s3?"":s3.toFixed(p)}</td>\n                            <td>${0==s4?"":s4.toFixed(p)}</td><td>${0==s5?"":s5.toFixed(p)}</td></tr>`,document.querySelector(".table-container tbody").innerHTML=rows}}else notifier.show("无操作权限","danger")}))}));