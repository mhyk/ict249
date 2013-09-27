$(window).load(function() {
	
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
		$(".txt-view").hide();
		$(".form-view").show();
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
		member.name= $("#fname").val();
		member.nick = $("#nick").val();
		member.owner = 1;
		member.related_id = $("#related-id").val();
		insertNewMember(member);
		$("#self-btn").trigger('click');
	});
	
	$("#save-family-btn").live("click",function(){
		var member = new Object();
		member.name= $("#fname").val();
		member.nick = $("#nick").val();
		member.relationship = $("#relationship").val();
		member.owner = 0;
		insertNewMember(member);		
	});
	
	//TAB BUTTONS
	
	$("#gallery-tab").live("click",function(){
		$("#gallery-tab").addClass("ui-btn-active ui-state-persist");
		$("#moreinfo-tab").removeClass("ui-btn-active ui-state-persist");
		$("#relationships-tab").removeClass("ui-btn-active ui-state-persist");
		
		$("#gallery").show();
		$("#moreinfo").hide();
		$("#relationships").hide();
		
	});
	
	$("#moreinfo-tab").live("click",function(){
		$("#moreinfo-tab").addClass("ui-btn-active ui-state-persist");
		$("#gallery-tab").removeClass("ui-btn-active ui-state-persist");
		$("#relationships-tab").removeClass("ui-btn-active ui-state-persist");
		
		$("#gallery").hide();
		$("#moreinfo").show();
		$("#relationships").hide();
		
	});
	
	$("#relationships-tab").live("click",function(){
		$("#relationships-tab").addClass("ui-btn-active ui-state-persist");
		$("#moreinfo-tab").removeClass("ui-btn-active ui-state-persist");
		$("#relationships-tab").removeClass("ui-btn-active ui-state-persist");
		
		$("#gallery").hide();
		$("#moreinfo").hide();
		$("#relationships").show();
	});
		
	$('#searchmember').live('keypress',function(e){
		if(e.which == 13) {
        	search();
        }
	});
	
	$("#edit-profile-btn").live('click',function(){
		$(".txt-view").hide();
		$(".form-view").show();
	});

	$("#update-profile-btn").live("click",function(){
		var member = new Object();
		member.id = $("#prof-id").val();
		member.name= $("#profNameTxt").val();
		member.nick = $("#profNickTxt").val();
		member.phone = $("#profPhoneTxt").val();
		member.email = $("#profEmailTxt").val();
		member.bday = $("#profBdayTxt").val();
		updateMember(member);
		$(".txt-view").show();
		$(".form-view").hide();
		
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