
<!-- FIXME: hardcode id -->
async function set_sidebar_recommendation() {
	var elem = document.getElementById("sidebar_recommendation"); 
	elem.innerHTML = 
	'<a target="_blank" href="https://www.amazon.cn/dp/B078CQX5PR/ref=sr_1_1?__mk_zh_CN=%25E4%25BA%259A%25E9%25A9%25AC%25E9%2580%258A%25E7%25BD%2591%25E7%25AB%2599&amp;dchild=1&amp;keywords=%25E6%258B%2596%25E6%258B%2589%25E4%25B8%2580%25E7%2582%25B9%25E4%25B9%259F%25E6%2597%25A0%25E5%25A6%25A8&amp;qid=1622995737&amp;sr=8-1&_encoding=UTF8&tag=blo-23&linkCode=ur2&linkId=ac63283dbf72695f5109ea54c04c6ba2&camp=536&creative=3200">《拖拉一点也无妨》</a>' +
	'<br />' +
	'<a target="_blank" href="https://www.amazon.cn/gp/product/B07Z4BVKT7/ref=ppx_yo_dt_b_d_asin_title_o01?ie=UTF8&amp;psc=1&_encoding=UTF8&tag=blo-23&linkCode=ur2&linkId=174cfff1a4a611310e27b5ad5460c5d1&camp=536&creative=3200">《IBM和纳粹》</a>';
	//console.log(elem);
}


console.log("Set ads");

set_sidebar_recommendation();