import{notifier}from"../parts/notifier.mjs";import{alert_confirm}from"../parts/alert.mjs";var hiprintTemplate;document.querySelector("#function-set .nav-icon").classList.add("show-chosed"),document.querySelector("#function-set .menu-text").classList.add("show-chosed");var options,edit_mode="新增";function first_page(){var configElementTypeProvider=function(options){return{addElementTypes:function(context){context.allElementTypes=[],context.testModule=[],context.addPrintElementTypes("testModule",[new hiprint.PrintElementTypeGroup("自定义",[{tid:"configModule.customText",title:"自定义文本",customText:"自定义文本",custom:!0,type:"text"}])])}}};hiprint.init({providers:[new configElementTypeProvider]}),template_init({panels:[{index:0,height:93.1,width:190,paperHeader:0,paperFooter:266.45669291338584,printElements:[{tid:"configModule.customText",options:{left:153,top:90,height:30,width:243,title:" 欢迎使用报表设计，请先选择单据",fontSize:15,fontWeight:"bold",color:"#2196f3",textAlign:"center",textContentVerticalAlign:"middle"}}],paperNumberLeft:508.5,paperNumberTop:244.5,paperNumberDisabled:!0}]}),document.querySelector(".about-this").textContent="更多帮助点击右上角“ ？”按钮"}function reset_ctrol(yes){let no=!yes;document.querySelector("#newmodel-select").disabled=yes,document.querySelector("#newmodel-name").disabled=yes,document.querySelector("#editmodel-select").disabled=no,document.querySelector("#edit-select").disabled=no,document.querySelector("#editmodel-name").disabled=no,document.querySelector("#del-button").disabled=no,document.querySelector("#choose-edit").parentNode.style.cssText=""}function alert_clear(){hiprintTemplate.getJsonTid().panels[0].printElements.length>1?alert_confirm("设计框内容将被重置，确认重置吗？",{confirmText:"是",cancelText:"否",confirmCallBack:()=>{first_page()}}):first_page()}function reset_content(){document.querySelector("#newmodel-name").value="",document.querySelector("#editmodel-name").value="",document.querySelector("#default-check").checked=!1,document.querySelector("#newmodel-select").innerHTML=options,document.querySelector("#editmodel-select").innerHTML=options,document.querySelector("#edit-select").innerHTML="<option value=0 selected hidden>请选择模板</option>"}function fetch_provider(id,model_json){fetch(`/${code}/fetch_provider`,{method:"post",headers:{"Content-Type":"application/json"},body:Number(id)}).then((response=>response.json())).then((content=>{if(-1!=content){let html_data=content[1].split(","),lis="";for(let html of html_data){let h=html.split(":");lis+=`<li><a class="ep-draggable-item" tid="${h[0]}">${h[1]}</a></li>`}document.querySelector("#pre-set").innerHTML=lis;var configElementTypeProvider=function(options){return{addElementTypes:function(context){context.allElementTypes=[],context.testModule=[],context.addPrintElementTypes("testModule",[new hiprint.PrintElementTypeGroup("常规",JSON.parse(content[0])),new hiprint.PrintElementTypeGroup("自定义",[{tid:"configModule.customText",title:"自定义文本",customText:"自定义文本",custom:!0,type:"text"},{tid:"configModule.image",title:"图片",data:`/${code}/assets/img/logo.png`,type:"image"},{tid:"configModule.tableCustom",title:"表格",type:"tableCustom",field:"table",options:{width:500}}]),new hiprint.PrintElementTypeGroup("辅助",[{tid:"configModule.hline",title:"横线",type:"hline"},{tid:"configModule.vline",title:"竖线",type:"vline"},{tid:"configModule.rect",title:"矩形",type:"rect"},{tid:"configModule.oval",title:"椭圆",type:"oval"}])])}}},configPrintJson=model_json||JSON.parse(content[2]);hiprint.init({providers:[new configElementTypeProvider]}),hiprint.PrintElementTypeManager.buildByHtml($(".ep-draggable-item")),hiprintTemplate.getJsonTid().panels[0].printElements.length>1?alert_confirm("设计框内容将被重置，确认重置吗？",{confirmText:"是",cancelText:"否",confirmCallBack:()=>{template_init(configPrintJson)}}):template_init(configPrintJson)}else notifier.show("权限不够，操作失败","danger")}))}function template_init(configPrintJson){document.querySelector("#hiprint-printTemplate").innerHTML="",document.querySelector("#PrintElementOptionSetting").innerHTML="",(hiprintTemplate=new hiprint.PrintTemplate({template:configPrintJson,settingContainer:"#PrintElementOptionSetting",paginationContainer:".hiprint-printPagination"})).design("#hiprint-printTemplate");let paper_type=configPrintJson.panels[0].paperType,width=configPrintJson.panels[0].width,height=configPrintJson.panels[0].height;document.querySelector("#paper-type").value=paper_type?`当前纸张：${paper_type}`:`当前纸张：${width}mm * ${height}mm`,setTimeout((()=>{document.querySelector(".hiprint-printPanel").click()}),100)}fetch(`/${code}/fetch_print_documents`).then((response=>response.json())).then((content=>{if(-1!=content){options="<option value=0 selected hidden>请选择单据</option>";for(let data of content)options+=`<option value="${data.id}">${data.name}</option>`;document.querySelector("#newmodel-select").innerHTML=options,document.querySelector("#editmodel-select").innerHTML=options,first_page(),document.querySelector(".gener-code").style.display="none"}else notifier.show("权限不够，操作失败","danger")})),$("#paper-directPrint").click((function(){hiprintTemplate.print(printData)})),$("#A4_getJson_toTextarea").click((function(){$("#A4_textarea_json").html(JSON.stringify(hiprintTemplate.getJsonTid()))})),document.querySelector("#paper-a4").addEventListener("click",(function(){hiprintTemplate.setPaper("A4"),document.querySelector("#paper-type").value="当前纸张：A4"})),document.querySelector("#paper-a5").addEventListener("click",(function(){hiprintTemplate.setPaper("A5"),document.querySelector("#paper-type").value="当前纸张：A5"})),document.querySelector("#paper-custom").addEventListener("click",(function(){let width=$("#customWidth").val(),height=$("#customHeight").val();hiprintTemplate.setPaper(width,height),document.querySelector("#paper-type").value=`当前纸张：${width}mm * ${height}mm`})),document.addEventListener("keydown",(function(e){"Delete"==e.key&&"INPUT"!=e.target.tagName&&"TEXTAREA"!=e.target.tagName&&document.querySelector("#del").click()})),document.querySelector("#sumit").addEventListener("click",(function(){document.querySelector("#PrintElementOptionSetting .hiprint-option-item-submitBtn").click()})),document.querySelector("#del").addEventListener("click",(function(){document.querySelector("#PrintElementOptionSetting .hiprint-option-item-deleteBtn").click(),document.querySelector(".hiprint-printPanel").click()})),document.querySelector("#choose-new").addEventListener("click",(function(){if("新增"!=edit_mode){edit_mode="新增",reset_ctrol(!1),this.parentNode.style.fontWeight="bold",hiprintTemplate.getJsonTid().panels[0].printElements.length>1&&(alert_clear(),reset_content())}})),document.querySelector("#choose-edit").addEventListener("click",(function(){if("编辑"!=edit_mode){edit_mode="编辑",reset_ctrol(!0),this.parentNode.style.fontWeight="bold",hiprintTemplate.getJsonTid().panels[0].printElements.length>1&&(alert_clear(),reset_content())}})),document.querySelector("#newmodel-select").addEventListener("change",(function(){fetch_provider(this.value),document.querySelector("#newmodel-name").value="",document.querySelector("#editmodel-name").value="",document.querySelector("#default-check").checked=!1,document.querySelector(".about-this").textContent="设计框中是样板示例，可在此基础上修改，也可重新设计"})),document.querySelector("#editmodel-select").addEventListener("change",(function(){fetch_provider(this.value,{first:!0,panels:[{index:0,height:93.1,width:190,paperHeader:0,paperFooter:266.45669291338584,printElements:[{tid:"configModule.customText",options:{left:153,top:90,height:30,width:243,title:"修改报表模板，请选择打印模板",fontSize:15,fontWeight:"bold",color:"#2196f3",textAlign:"center",textContentVerticalAlign:"middle"}}],paperNumberLeft:508.5,paperNumberTop:244.5,paperNumberDisabled:!0}]});let id=Number(document.querySelector("#editmodel-select").value);fetch(`/${code}/fetch_models`,{method:"post",headers:{"Content-Type":"application/json"},body:id}).then((response=>response.json())).then((content=>{let model_options="<option value=0 selected hidden>请选择模板</option>";for(let data of content)model_options+=`<option value="${data.id}" data=${data.default}>${data.name}</option>`;document.querySelector("#edit-select").innerHTML=model_options}))})),document.querySelector("#edit-select").addEventListener("change",(function(){fetch(`/${code}/fetch_one_model`,{method:"post",headers:{"Content-Type":"application/json"},body:Number(this.value)}).then((response=>response.json())).then((content=>{if(-1!=content){document.querySelector("#default-check").checked=content[0],document.querySelector("#newmodel-name").value="",document.querySelector("#editmodel-name").value="",hiprintTemplate.getJsonTid().panels[0].printElements.length>1?alert_confirm("设计框内容将被重置，确认重置吗？",{confirmText:"是",cancelText:"否",confirmCallBack:()=>{template_init(JSON.parse(content[1]))}}):template_init(JSON.parse(content[1])),document.querySelector(".about-this").textContent="设计框中是已保存的模板，可在此基础上修改，也可重新设计"}else notifier.show("权限不够，操作失败","danger")}))})),document.querySelector("#save-button").addEventListener("click",(function(){let id,name,print_id;if("新增"==edit_mode?(id=0,name=document.querySelector("#newmodel-name").value,print_id=document.querySelector("#newmodel-select").value):(id=document.querySelector("#edit-select").value,name=document.querySelector("#editmodel-name").value,print_id=document.querySelector("#editmodel-select").value),"新增"==edit_mode&&(0==print_id||""==name))return notifier.show("单据或名称不能为空","danger"),!1;if("编辑"==edit_mode&&0==id)return notifier.show("编辑单据不能为空","danger"),!1;let model=hiprintTemplate.getJsonTid();if(model.panels[0].printElements.length>1){let data={id:Number(id),print_id:Number(print_id),name:name,model:JSON.stringify(model),default:document.querySelector("#default-check").checked,cate:edit_mode};fetch(`/${code}/save_model`,{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)}).then((response=>response.json())).then((content=>{1==content?notifier.show("模板保存成功","success"):notifier.show("权限不够，操作失败","danger")}))}else notifier.show("模板不能为空","danger")})),document.querySelector("#del-button").addEventListener("click",(function(){let id=document.querySelector("#edit-select").value;0!=id?alert_confirm("模板删除后无法恢复，确认删除吗？",{confirmText:"确认",cancelText:"取消",confirmCallBack:()=>{fetch(`/${code}/del_model`,{method:"post",headers:{"Content-Type":"application/json"},body:Number(id)}).then((response=>response.json())).then((content=>{1==content?(changed=0,edit_mode="新增",document.querySelector("#choose-edit").click(),notifier.show("模板删除成功","success")):notifier.show("权限不够，操作失败","danger")}))}}):notifier.show("请先选择模板","danger")}));