import{SPLITER}from"../parts/tools.mjs";export class AutoInput{constructor(input,cate,url,cb){this.input=input,this.cate=cate,this.url=url,this.cb=cb,this.space=400}init(){var currentFocus,input=this.input,cb=this.cb;function addActive(x){if(!x)return!1;!function(x){for(var i=0;i<x.length;i++)x[i].classList.remove("autocomplete-active")}(x),currentFocus>=x.length&&(currentFocus=0),currentFocus<0&&(currentFocus=x.length-1),x[currentFocus].classList.add("autocomplete-active")}function closeAllLists(elmnt){var x=document.querySelector(".autocomplete-items");x&&elmnt!=x&&elmnt!=input&&x.parentNode.removeChild(x)}input.addEventListener("input",(()=>{var a,b,i,val=input.value,space=this.space;if(closeAllLists(),!val)return!1;currentFocus=-1;var get_url=""==this.cate?`${this.url}?s=${val}`:`${this.url}?s=${val}&cate=${this.cate.textContent}`;fetch(get_url).then((response=>response.json())).then((function(arr){if(-1!=arr&&arr.length>0){for((a=document.createElement("DIV")).setAttribute("id","autocomplete-list"),a.setAttribute("class","autocomplete-items"),input.parentNode.appendChild(a),i=0;i<arr.length;i++)(b=document.createElement("DIV")).innerHTML=arr[i].label,b.innerHTML+="<input type='hidden' id='"+arr[i].id+"' value='"+arr[i].label+"'>",b.addEventListener("click",(function(e){e.stopPropagation(),input.value=this.querySelector("input").value,input.setAttribute("data",this.querySelector("input").getAttribute("id")),closeAllLists(),cb()})),a.appendChild(b);a.clientHeight>space&&(a.style.top=-(a.clientHeight-space+30)+"px",a.style.left="120px",a.style.borderTop="1px solid #9acffa")}}))})),input.addEventListener("keydown",(function(e){var x=document.querySelectorAll("#autocomplete-list div");x.length>0&&("ArrowDown"==e.key?(currentFocus++,addActive(x)):"ArrowUp"==e.key?(currentFocus--,addActive(x)):"Enter"==e.key?(e.preventDefault(),currentFocus>-1?x[currentFocus].click():x[0].click()):"Escape"==e.key?closeAllLists():"Tab"==e.key&&(e.preventDefault(),currentFocus>-1?x[currentFocus].click():x[0].click()))})),document.addEventListener("click",(function(e){closeAllLists(e.target)}))}}export function auto_table(input,cate,url,thead,cb){var currentFocus;function addActive(x){if(!x)return!1;!function(x){for(var i=0;i<x.length;i++)x[i].classList.remove("autocomplete-active")}(x),currentFocus>=x.length&&(currentFocus=0),currentFocus<0&&(currentFocus=x.length-1),x[currentFocus].classList.add("autocomplete-active")}function closeAllLists(elmnt){var x=document.querySelector(".autocomplete-items");x&&elmnt!=x&&elmnt!=input&&x.parentNode.removeChild(x)}input.addEventListener("input",(function(e){var a,i,val=this.value;if(closeAllLists(),!val)return!1;currentFocus=-1;var get_url=""==cate?`${url}?s=${val}`:`${url}?s=${val}&cate=${cate.textContent}`;fetch(get_url).then((response=>response.json())).then((function(arr){if(-1!=arr&&arr.length>0){(a=document.createElement("DIV")).setAttribute("id","autocomplete-list"),a.setAttribute("class","autocomplete-items table-auto"),a.innerHTML="<table><thead><tr></tr></thead><tbody></tbody></table>",input.parentNode.appendChild(a);let ths="";for(let i=0;i<thead.length;i++)ths+=`<th width=${thead[i].width}>${thead[i].name}</th>`;document.querySelector(".table-auto thead tr").innerHTML=ths;let tbody=document.querySelector(".table-auto tbody");for(i=0;i<arr.length;i++){let items=arr[i].label.split(SPLITER),tr=document.createElement("tr");tr.setAttribute("data",`${arr[i].id}${SPLITER}${arr[i].label}`);let row="";for(let i=0;i<items.length-1;i++)row+=`<td width=${thead[i].width}>${items[i]}</td>`;tr.innerHTML=row,tr.addEventListener("click",(function(e){e.stopPropagation(),input.value=this.querySelector("td:nth-child(1)").textContent,input.setAttribute("data",this.getAttribute("data")),closeAllLists(),cb()})),tbody.appendChild(tr)}}}))})),input.addEventListener("keydown",(function(e){var x=document.querySelectorAll("#autocomplete-list tbody tr");x.length>0&&("ArrowDown"==e.key?(currentFocus++,addActive(x)):"ArrowUp"==e.key?(currentFocus--,addActive(x)):"Enter"==e.key?(e.preventDefault(),currentFocus>-1?x[currentFocus].click():x[0].click()):"Escape"==e.key?closeAllLists():"Tab"==e.key&&(e.preventDefault(),currentFocus>-1?x[currentFocus].click():x[0].click()))})),document.addEventListener("click",(function(e){closeAllLists(e.target)}))}