chrome.browserAction.onClicked.addListener(function(tab_something) {

	console.log("click");
		
	chrome.tabs.getSelected(null, function(tab) {
					
		chrome.tabs.sendRequest(tab.id, {command: "parse"}, function(response) {
		
		
		});
		
	});
							
});

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	
	console.log(request.link);
	
	if(request.command=="ajax"){
	
		$.ajax{
            type: "POST", //or GET
            url: request.link,
            crossDomain:true,
            cache:false,
            async:false,
            success: function(msg){
				console.log(" msg " + msg);
           },
           error: function(jxhr){
				console.log(" error " + jxhr.responseText);
                //do some thing
           }
         }
		
	}
	
});