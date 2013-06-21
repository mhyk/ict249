
var freebase_search = "https://www.googleapis.com/freebase/v1/search?query=";
var freebase_text = "https://www.googleapis.com/freebase/v1/text";
var freebase_img = "https://www.googleapis.com/freebase/v1/image";
$(document).ready(function(){
	$(document).on('pagebeforehide', '[data-role="page"]',function(e,data){  
        var loader = setInterval(function(){
        	$.mobile.utils.showWaitBox("a", "Loading...");
            clearInterval(loader);
        },1); 
    }); 

    $(document).on('pageshow', '[data-role="page"]',function(e,data){  
        var loader = setInterval(function(){
        	$.mobile.utils.hideWaitBox();
            clearInterval(loader);
        },1); 
    });    
	
	$("#search-btn").click(function(){
		search();
	});
	
	$("#search-txt").keypress(function(e) {
        if(e.which == 13) {
        	$("#search-btn").trigger('click');
            return false;
        }
    });
	
	$(".details").live("click",function(){		
		var name = $(this).attr("name");
		var id = $(this).attr("id"); 
		var category = $(this).attr("category"); 
		var url = freebase_text+id;
		$.ajax({
			type: "GET",		
			url: url,		
			dataType: "json",
			success: function(msg){
				var html = "<h2>"+name+"</h2><p style='margin:5px 0 5px 0;'><i>"+category+"</i></p><p>"+msg.result+"</p>";				
				$("#detail-info").html(html);				
			}
		});
	});
	
	document.addEventListener("backbutton", function () { 
        navigator.notification.confirm(
                  'Do you want to quit', 
                  onConfirmQuit, 
                  'QUIT TITLE', 
                  'OK,Cancel'  
              );
      }, true); 



});

function onConfirmQuit(button){
	if(button == "1"){
		navigator.app.exitApp();
		}
	}

function search(){	
	var searchText = $("#search-txt").val();
	var url = freebase_search+searchText+"&indent=true";	
	$('#resultList').html("");
	$.getJSON(url, function(data) {
		$('#resultList li').remove();
		results = data.result;
		if(results.length > 0){
			$.each(results, function(index, result) {
				var category = "";
				if(result.notable)
					category = result.notable.name;
				$('#resultList').append('<li><a href="#details-page" class="details" category="'+category+'"id="'+result.id+'" name="'+result.name+'"><img src="'+freebase_img+result.id+'" class="ul-li-has-thumb"/>' +
						'<h3>'+ result.name +'</h3><p><i>' + category + '</i></p></a></li>');
			});
			$('#resultList').listview('refresh');
		}
		else{
			$('#resultList').html("<center><h3>No Results Found!</h3></center");
		}
	});
	
	$('.home-btn').live('click',function(){
		$("#search-txt").val('');
	})
}