$(window).load(function() {
	
	var timer;
	
	setTreeSize();
	initDB();
	
	$("#self-btn").live("click",function(){
		checkSelf();
	});
	
	$(".home-btn").live("click",function(){
		initDB();
	});
	
	$(".details").live("click",function(){
		var id = $(this).attr('id');
		getProfile(id);
		$("#summary").show();
		$("#moreinfo").hide();
		$("#relationships").hide();
		$("#prof-id").val(id);
	});
	
	$("#add-relationship").live("click",function(){
		var id = $("#prof-id").val();
		$("#related-id").val(id);
	});
	
	$("#member-btn").live("click",function(){
		getAllMembers();
	});
	
	$("#save-profile-btn").live("click",function(){
		var member = new Object();
		member.name= $("#name").val();
		member.nick = $("#nick").val();
		member.owner = 1;
		member.related_id = $("#related-id").val();
		insertNewMember(member);
		$("#self-btn").trigger('click');
	});
	
	$("#save-family-btn").live("click",function(){
		var member = new Object();
		member.name= $("#name").val();
		member.nick = $("#nick").val();
		member.relationship = $("#relationship").val();
		member.owner = 0;
		insertNewMember(member);		
	});
	
	//TAB BUTTONS
	
	$("#gallery-tab").live("click",function(){
		$("#gallery-tab").addClass("ui-btn-active");
		$("#moreinfo-tab").removeClass("ui-btn-active");
		$("#relationships-tab").removeClass("ui-btn-active");
		
		$("#gallery").show();
		$("#moreinfo").hide();
		$("#relationships").hide();
		
	});
	
	$("#moreinfo-tab").live("click",function(){
		$("#moreinfo-tab").addClass("ui-btn-active");
		$("#gallery-tab").removeClass("ui-btn-active");
		$("#relationships-tab").removeClass("ui-btn-active");
		
		$("#gallery").hide();
		$("#moreinfo").show();
		$("#relationships").hide();
		
	});
	
	$("#relationships-tab").live("click",function(){
		$("#relationships-tab").addClass("ui-btn-active");
		$("#moreinfo-tab").removeClass("ui-btn-active");
		$("#relationships-tab").removeClass("ui-btn-active");
		
		$("#gallery").hide();
		$("#moreinfo").hide();
		$("#relationships").show();
	});
	
	$('#searchmember').live('keyup',function(){		
		timer = setTimeout(search, 2000);
	});
	
	$('#searchmember').live('keydown',function(){
		clearTimeout(timer);
	});

});

function setTreeSize() {
	var width = window.innerWidth;
	var height = window.innerHeight - 50;
	$(".basicdiagram").width(width);
	$(".basicdiagram").height(height);
}

function search(){
	var txt = $('#searchmember').val();
	searchMembers(txt);
}