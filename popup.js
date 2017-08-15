$( document ).ready(function() {
    $("#search_harvest")
		.on("click", function(){
			$("#status-holder")
				.html("Starting...");
			chrome.extension.sendMessage({command: "parse"},
				function (response) {
				});
		});
		
	$("#stop_button")
		.on("click", function(){
			$("#status-holder")
				.html("Stopping...");
			chrome.extension.sendMessage({command: "stop"},
				function (response) {
				});
		});
});

chrome.extension.onMessage.addListener( 
	function(request,sender,sendResponse){
		
		if(request.command=="data"){
			$("#data-holder")
				.html(request.message);
		}
		
		if(request.command=="status"){
			$("#status-holder")
				.html("Status: " + request.message);
		}
		
	}
);
