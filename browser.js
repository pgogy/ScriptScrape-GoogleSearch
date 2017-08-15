var tabID = "";
var nextURL = "";
var counter = 1;
var started = false;
var stop = false;

chrome.tabs.onUpdated.addListener(
  function(tabId, changeInfo, tab) {
  
	tabID = tabId;
  
	if(started){
	
		if(!stop){
  
			if(changeInfo.status=="loading"){
				nextURL = changeInfo.url;
			}
			if(changeInfo.status=="complete"){
			
				chrome.extension.sendMessage({command: "status", message: "Changing page"}, function(response) {

				}); 
			
				chrome.tabs.sendMessage(tabID, {command: "restart"}, function(response) {
				
				
				});
				
			}
			
		}else{
		
			chrome.extension.sendMessage({command: "status", message: "Stopped"}, function(response) {

				}); 
		
		}
		
	}
	
  }
);

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	
	if(request.command=="parse"){
		console.log("sending parse");
		chrome.tabs.getSelected(null, function(tab) {
				
			chrome.tabs.sendMessage(tabID, {command: "parse"}, function(response) {
			
			
			});
			
		});
	}
	
	if(request.command=="stop"){
		console.log("sending stop");
		stop = true;
		chrome.tabs.getSelected(null, function(tab) {
				
			chrome.tabs.sendMessage(tabID, {command: "stop"}, function(response) {
			
			
			});
			
		});
	}
	
	if(request.command=="ajax"){
	
		started = true;
	
		var xmlHttpRequest = new XMLHttpRequest();
			
		url = request.link['link'];
																
		xmlHttpRequest.open("GET",url,true);
		xmlHttpRequest.onreadystatechange=function(){
				
			if (xmlHttpRequest.readyState==4){
				
				chrome.extension.sendMessage({command: "status", message: "Getting URLs"}, function(response) {

				});
								
				response = xmlHttpRequest.responseText;
				
				var div = document.createElement('div');
				div.innerHTML = response;
				
				var scripts = div.getElementsByTagName('script');
				var i = scripts.length;
				while (i--) {
				  scripts[i].parentNode.removeChild(scripts[i]);
				}
				
				var style = div.getElementsByTagName('style');
				var i = style.length;
				while (i--) {
				  style[i].parentNode.removeChild(style[i]);
				}
				
				var text = div.innerHTML;
				
				text = text.replace(/<\/?[^>]+(>|$)/g, " ");
				
				chrome.tabs.getSelected(null, function(tab) {
				
					chrome.tabs.sendMessage(tabID, {command: "output",output:text,url:url,extra:request.link}, function(response) {
					
					
					});
					
				});
				
			}
	
		};	
		
		xmlHttpRequest.send();	
			
	}
	
});