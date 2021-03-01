import{notifier}from"../parts/notifier.mjs";document.querySelector("#statics .nav-icon").classList.add("show-chosed"),document.querySelector("#statics .menu-text").classList.add("show-chosed");var myChart,ctx=document.getElementById("myChart").getContext("2d"),char_data={data:{datasets:[{label:"库存成本",backgroundColor:"rgba(255, 99, 132, 0.5)",borderColor:"rgba(255, 99, 132, 1)",borderWidth:1}]},options:{scales:{yAxes:[{ticks:{beginAtZero:!0}}]}}};let m="个月",w="周",d="天",y="年",info=document.querySelector("#info2"),statis_cate_s=localStorage.getItem("statis_cost_cate"),chart_cate_s=localStorage.getItem("chart_cost_cate"),statis_cate=statis_cate_s||"按月",chart_cate=chart_cate_s||"折线图";if(document.querySelector("#chart-cate").value=chart_cate,"按月"==statis_cate){document.querySelector("#statis-cate").value="按月",document.querySelector("#search-date").value=6,set_chart({statis_cate:statis_cate,num:6})}else if("按年"==statis_cate){document.querySelector("#statis-cate").value="按年",document.querySelector("#search-date").value=6,info.textContent=y,set_chart({statis_cate:statis_cate,num:6})}else{"按周"==statis_cate?(document.querySelector("#statis-cate").value="按周",info.textContent=w):(document.querySelector("#statis-cate").value="按日",info.textContent=d),document.querySelector("#search-date").value=10,set_chart({statis_cate:statis_cate,num:10})}function set_chart(data){fetch(`/${code}/fetch_cost`,{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)}).then((response=>response.json())).then((content=>{if(-1!=content){let th_date=document.querySelector("#th-date");"按月"==data.statis_cate?th_date.textContent="月份":"按年"==data.statis_cate?th_date.textContent="年份":"按周"==data.statis_cate?th_date.textContent="周":th_date.textContent="日期";let rows="";for(let i=content[0].length-1;i>=0;i--)rows+=`<tr><td>${content[0][i]}</td><td>${content[1][i]}</td><td>${content[2][i]}</td></tr>`;document.querySelector(".table-container tbody").innerHTML=rows,char_data.type="柱状图"==chart_cate?"bar":"line",char_data.data.labels=content[1].reverse(),char_data.data.datasets[0].data=content[2].reverse(),char_data.data.datasets[0].fill="柱状图"==chart_cate,myChart&&myChart.destroy(),myChart=new Chart(ctx,char_data)}else notifier.show("无操作权限或无销售记录","danger")}))}document.querySelector("#statis-cate").addEventListener("change",(function(){"按月"==this.value?(info.textContent=m,document.querySelector("#search-date").value=6):"按年"==this.value?(info.textContent=y,document.querySelector("#search-date").value=6):("按周"==this.value?info.textContent=w:info.textContent=d,document.querySelector("#search-date").value=10)})),document.querySelector("#chart-cate").addEventListener("change",(function(){localStorage.setItem("chart_cost_cate",this.value),char_data.type="柱状图"==this.value?"bar":"line",char_data.data.datasets[0].fill="柱状图"==this.value,myChart.destroy(),myChart=new Chart(ctx,char_data)})),document.querySelector("#statis-button").addEventListener("click",(function(){chart_cate=document.querySelector("#chart-cate").value;let sta_cate=document.querySelector("#statis-cate").value,num=document.querySelector("#search-date").value;if(!num)return notifier.show("请输入正确数字","danger"),!1;set_chart({statis_cate:sta_cate,num:Number(num)}),localStorage.setItem("statis_cost_cate",sta_cate)}));