var stop = false;
var counter = 1;
var urls_found = new Array();
var all_urls = new Array();
var base = "";
var urls_counter = 0;
var urls_total = 0;
var start = 0;

chrome.extension.onMessage.addListener(
	 
	function(request, sender, sendResponse) {	
	
		if(request.command=="parse"){
	
			base = window.location.href;

			parse_document();
			
		}
		
		if(request.command=="output"){
			
			counter++;
				
			start = parseInt(GetURLParameter("start"));

			if(isNaN(start)){
				start = 0;
			}
					
			chrome.extension.sendMessage({command: "data", message: "Getting URL Number " + (start + counter)}, function(response) {

			});
			
			chrome.extension.sendMessage({command: "status", message: "Saving URL Number " + (counter) + " out of " + urls_total}, function(response) {

			});
			
			output(request);
			
		}
		
		if(request.command=="restart"){
		
			if(!stop){
				chrome.extension.sendMessage({command:"status",message:"Moving to next set of Google Results"},function(){});
				parse_document();
			}
			
		}
		
		if(request.command=="stop"){
			console.log("stop set");
			stop = true;
		}
		
	}     
		
);

function output(request){
	
	filename = request.extra.date + "_" + request.extra.link + "_" + request.extra.title;
	
	var blob = new Blob([request.extra.link + "\n\n\n" + request.output], {type: "text/plain;charset=utf-8"});	
	saveAs(blob, filename + ".txt");
	
	urls_counter-=1;
	
	if(urls_counter<=0){
		if(!stop){
			next_page();
		}else{
			chrome.extension.sendMessage({command:"status",message:"Stopped"},function(){});
		}
	}
	
}

function check_url(url) {

	chrome.extension.sendMessage({command:"ajax",link:url},function(){});

}


function GetURLParameter(sParam){

    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');

    for (var i = 0; i < sURLVariables.length; i++){

		var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam){
            return sParameterName[1];
        }

    }

}

function next_page(){
	start = GetURLParameter("start");
	console.log("start is " + start);
	if(start==undefined){
		start = 10;
		window.location.href = window.location.href + "&start=" + start;
	}else{
		start = parseInt(start) + 10;
		var sPageURL = window.location.search.substring(1);
		var sURLVariables = sPageURL.split('&');
		url = "search?q=" + GetURLParameter("q");
		for (var i = 0; i < sURLVariables.length; i++){

			var sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] == "start"){
				sParameterName[1] = start;
			}
			if (sParameterName[0] != "q"){
				url += "&" + sParameterName[0] + "=" + sParameterName[1];
			}
			window.location.href = url;
		}
		
	}
	
}

function parse_document(){

	var n = document;			
								
	if(document.location.toString().indexOf("www.google")!=-1){				
				
		var n = document.getElementById("search");
			
	}
			
	var rootNode = n;
	
	while (n) {
	
		if(n.hasAttributes!=undefined){
	
			if(n.hasAttributes()){
			
				if(n.hasAttribute("href")){
				
					href = n.getAttribute("href");
					
					if($.inArray(href, all_urls)==-1){
					
						all_urls.push(href);	
					
						if(href.toString().indexOf("google")==-1){
						
							if(href.toString().indexOf("http")==0){
								
								date = "00000000"
								
								if(n.parentNode.nextSibling!=null){
									if(n.parentNode.nextSibling.firstChild!=null){
										if(n.parentNode.nextSibling.firstChild.firstChild!=null){
											if(n.parentNode.nextSibling.firstChild.firstChild.nextSibling!=null){
												date = n.parentNode.nextSibling.firstChild.firstChild.nextSibling.firstChild.innerHTML;
												if(date!=undefined){
													date = date.split("-").join("");
													date = date.split(" ");
													month = "";
													switch(date[1]){
														case "Jan": month = "01"; break;
														case "Feb": month = "02"; break;
														case "Mar": month = "03"; break;
														case "Apr": month = "04"; break;
														case "May": month = "05"; break;
														case "Jun": month = "06"; break;
														case "Jul": month = "07"; break;
														case "Aug": month = "08"; break;
														case "Sep": month = "09"; break;
														case "Oct": month = "10"; break;
														case "Nov": month = "11"; break;
														case "Dec": month = "12"; break;
													}
													
													if(date[0].length==1){
														date[0] = "0" + date[0];
													}
													
													date = date[2] + month + date[0];
												}	
											}
										}
									}
								}
								
								var data = {link:href, title:n.innerHTML, date:date};
			
								urls_found.push(data);
								
							}							
						}

					}
				}
					
			}
			
		}

		if (n.v) {
			n.v = false;
			if (n == rootNode) {
				break;
			}
			if (n.nextSibling) {
				n = n.nextSibling;
			} else {
				n = n.parentNode;
			}
		} else {
			if (n.firstChild) {
				n.v = true;
				n = n.firstChild;
			}else if (n.nextSibling) {
				n = n.nextSibling;
			}else {
				n = n.parentNode;
			}
		}
				
	}
	
	urls_counter = urls_found.length;
	urls_total = urls_found.length;

	for(url in urls_found){
		if(!stop){
			check_url(urls_found[url]);
		}
	}
			
	urls_found = new Array();
	
}