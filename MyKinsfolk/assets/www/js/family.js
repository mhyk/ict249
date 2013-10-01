$(window).load(function() {

	setTreeSize();
	initDB();
	getTree();
	//var options = new primitives.orgdiagram.Config();

	$("#self-btn").live("click", function() {
		checkSelf();
	});

	$(".home-btn").live("click", function() {
		initDB();
		getTree();
	});

	$(".details").live("click", function() {
		var id = $(this).attr('id');
		getProfile(id);
		$("#gallery").hide();
		$("#moreinfo").show();
		$("#relationships").hide();
		$("#prof-id").val(id);
		$(".txt-view").show();
		$(".form-view").hide();
	});

	$("#add-relationship").live("click", function() {
		var id = $("#prof-id").val();
		$("#related-id").val(id);
	});

	$("#member-btn").live("click", function() {
		getAllMembers();
	});

	$("#save-profile-btn").live("click", function() {
		var member = new Object();
		member.name = $("#fname").val();
		member.nick = $("#nick").val();
		member.owner = 1;
		insertNewMember(member);
		$("#self-btn").trigger('click');
	});

	$("#save-family-btn").live("click", function() {
		var member = new Object();
		member.name = $("#fname").val();
		member.nick = $("#nick").val();
		member.relationship = $("#relationship").val();
		member.owner = 0;
		member.related_id = $("#related-id").val();
		insertNewMember(member);
	});

	// TAB BUTTONS

	$("#gallery-tab").live("click", function() {
		$("#gallery-tab").addClass("ui-btn-active ui-state-persist");
		$("#moreinfo-tab").removeClass("ui-btn-active ui-state-persist");
		$("#relationships-tab").removeClass("ui-btn-active ui-state-persist");

		$("#gallery").show();
		$("#moreinfo").hide();
		$("#relationships").hide();

	});

	$("#moreinfo-tab").live("click", function() {
		$("#moreinfo-tab").addClass("ui-btn-active ui-state-persist");
		$("#gallery-tab").removeClass("ui-btn-active ui-state-persist");
		$("#relationships-tab").removeClass("ui-btn-active ui-state-persist");

		$("#gallery").hide();
		$("#moreinfo").show();
		$("#relationships").hide();

	});

	$("#relationships-tab").live("click", function() {
		$("#relationships-tab").addClass("ui-btn-active ui-state-persist");
		$("#moreinfo-tab").removeClass("ui-btn-active ui-state-persist");
		$("#relationships-tab").removeClass("ui-btn-active ui-state-persist");

		$("#gallery").hide();
		$("#moreinfo").hide();
		$("#relationships").show();
		
		getFamily($("#prof-id").val());
	});

	$('#searchmember').live('keypress', function(e) {
		if (e.which == 13) {
			search();
		}
	});

	$("#edit-profile-btn").live('click', function() {
		$(".txt-view").hide();
		$(".form-view").show();
	});

	$("#update-profile-btn").live("click", function() {
		var member = new Object();
		member.id = $("#prof-id").val();
		member.name = $("#profNameTxt").val();
		member.nick = $("#profNickTxt").val();
		member.phone = $("#profPhoneTxt").val();
		member.email = $("#profEmailTxt").val();
		member.bday = $("#profBdayTxt").val();
		updateMember(member);
		$(".txt-view").show();
		$(".form-view").hide();

	});

	$("#tree-btn").live("click", function() {
		// getTree();
		// console.log($(".tree-root").html());
		var options = new primitives.orgdiagram.Config();
		var json = '{"nodes":[';
		var i = 1;
		$(".tree-root li").each(function() {
			if (i != 1)
				json += ','
			json += $(this).html();
			i++;
		});
		json += ']}';
		//console.log(json);
		var data = jQuery.parseJSON(json);
		console.log(data.nodes.length);
		var parents = new Array();
		$.each(data.nodes, function(index, item) {
			var node = new primitives.orgdiagram.ItemConfig();
			node.title = item.name;
			node.description = '';
			parents[item.id] = node;
			if(item.type == "root"){				
				options.rootItem = node;
				options.cursorItem = node;
				options.hasSelectorCheckbox = primitives.common.Enabled.False;
				options.pageFitMode = primitives.orgdiagram.PageFitMode.None;
				$(".basicdiagram").orgDiagram(options);
			}
			else if(item.type == "spouse"){
				var parent = parents[item.parent];
				parent.constructor = primitives.orgdiagram.ItemConfig;
				node.itemType = primitives.orgdiagram.ItemType.Adviser;
				node.adviserPlacementType = primitives.orgdiagram.AdviserPlacementType.Right;
				parent.items.push(node);
				$(".basicdiagram").orgDiagram("update", primitives.orgdiagram.UpdateMode.Refresh);
			}
			else{
				var parent = parents[item.parent];
				parent.constructor = primitives.orgdiagram.ItemConfig;
				parent.items.push(node);
				$(".basicdiagram").orgDiagram("update", primitives.orgdiagram.UpdateMode.Refresh);
			}
		});
		
		
	});

	function Node() {
		this.id = '';
		this.name = '';
		this.children = new Array();
	}

	Node.prototype = {
		constructor : Node,
		setId : function(newId) {
			this.id = newId;
			return this.id;
		},
		setName : function(newName) {
			this.name = name;
			return this.name;
		},
		addChild : function(child) {
			this.children.push(child);
			return this.children;
		}
	};
});

function setTreeSize() {
	var width = window.innerWidth;
	var height = window.innerHeight - 50;
	$(".basicdiagram").width(width);
	$(".basicdiagram").height(height);
}

function search() {
	var txt = $('#searchmember').val();
	searchMembers(txt);
}
