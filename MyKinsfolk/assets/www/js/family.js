$(window).load(function() {
	setTreeSize();
	initDB();
	
	$("#self-btn").live("click",function(){
		checkSelf();
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
		member.fname= $("#fname").val();
		member.lname = $("#lname").val();
		member.nick = $("#nick").val();
		member.owner = 1;
		member.related_id = $("#related-id").val();
		insertNewMember(member);
		$("#self-btn").trigger('click');
	});
	
	$("#save-family-btn").live("click",function(){
		var member = new Object();
		member.fname= $("#fname").val();
		member.lname = $("#lname").val();
		member.nick = $("#nick").val();
		member.relationship = $("#relationship").val();
		member.owner = 0;
		insertNewMember(member);		
	});
	
	//TAB BUTTONS
	
	$("#summary-tab").live("click",function(){
		$("#summary-tab").addClass("ui-btn-active");
		$("#moreinfo-tab").removeClass("ui-btn-active");
		$("#relationships-tab").removeClass("ui-btn-active");
		
		$("#summary").show();
		$("#moreinfo").hide();
		$("#relationships").hide();
		
	});
	
	$("#moreinfo-tab").live("click",function(){
		$("#moreinfo-tab").addClass("ui-btn-active");
		$("#summary-tab").removeClass("ui-btn-active");
		$("#relationships-tab").removeClass("ui-btn-active");
		
		$("#summary").hide();
		$("#moreinfo").show();
		$("#relationships").hide();
		
	});
	
	$("#relationships-tab").live("click",function(){
		$("#relationships-tab").addClass("ui-btn-active");
		$("#moreinfo-tab").removeClass("ui-btn-active");
		$("#relationships-tab").removeClass("ui-btn-active");
		
		$("#summary").hide();
		$("#moreinfo").hide();
		$("#relationships").show();
	});

});

function setTreeSize() {
	var width = window.innerWidth;
	var height = window.innerHeight - 50;
	$(".basicdiagram").width(width);
	$(".basicdiagram").height(height);
}
