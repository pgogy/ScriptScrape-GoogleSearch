chrome.browserAction.onClicked.addListener(function(tab_something) {

	chrome.tabs.getSelected(null, function(tab) {
					
		chrome.tabs.sendMessage(tab.id, {command: "parse"}, function(response) {
		
		
		});
		
	});
							
});

var nextURL = "";

chrome.tabs.onUpdated.addListener(
  function(tabId, changeInfo, tab) {
  
	if(started){
  
		if(changeInfo.status=="loading"){
			nextURL = changeInfo.url;
		}
		if(changeInfo.status=="complete"){
			chrome.tabs.sendMessage(tabId, {command: "restart"}, function(response) {
			
			
			});
		}
		
	}
	
  }
);

var started = false;

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	
	if(request.command=="ajax"){
	
		started = true;
	
		var xmlHttpRequest = new XMLHttpRequest();
			
		url = request.link['link'];
																
		xmlHttpRequest.open("GET",url,true);
		xmlHttpRequest.onreadystatechange=function(){
		  
			if (xmlHttpRequest.readyState==4){
													
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
				
					chrome.tabs.sendMessage(tab.id, {command: "output",output:text,url:url,extra:request.link}, function(response) {
					
					
					});
					
				});
				
			}
	
		};	
		
		xmlHttpRequest.send();	
			
	}
	
});