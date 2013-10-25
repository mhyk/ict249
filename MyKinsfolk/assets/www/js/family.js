$(window)
		.load(
				function() {

					setTreeSize();
					initDB();
					getTree();
					// var options = new primitives.orgdiagram.Config();
					onDeviceReady();

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
						if ($("#fname").val() == "") {
							alert("Please Enter name");
						} else {
							var member = new Object();
							member.name = $("#fname").val();
							member.nick = $("#nick").val();
							member.owner = 1;
							member.gender = $("#gender").val();
							insertNewMember(member);
							$("#self-btn").trigger('click');
						}

					});

					$("#save-family-btn").live("click", function() {
						if ($("#rname").val() == "") {
							alert("Please Enter name");
						} else {
							var member = new Object();
							member.name = $("#rname").val();
							member.nick = $("#rnick").val();
							member.relationship = $("#relationship").val();
							member.owner = 0;
							member.related_id = $("#related-id").val();
							insertNewMember(member);
							getProfile($("#related-id").val());
							$("#relationships-tab").trigger('click');
						}

					});

					//GALLERY

					$(".img-thumb").live("click", function() {
						var width = window.innerWidth - 40;
						var height = window.innerHeight - 50;
						$("#gallery-popup").width(width);
						$("#gallery-popup").height(height);
						$("#gallery-popup").css({
							top : 0,
							left : 0
						});
						var src = $(this).attr("img-src");
						var id = $(this).attr("img-id");
						$("#photoID").val(id);
						$("#img-large").attr('src', src);
						$("#img-large").imgscale();
					});

					$("#setPrimary").live("click", function() {
						var id = $("#prof-id").val();
						var picid = $("#photoID").val();
						unsetPrimary(id);
						savePrimary(id, picid);
						getProfile(id);
						$("#gallery-tab").trigger('click');
					});

					// TAB BUTTONS

					$("#gallery-tab").live("click", function() {

						$("#gallery").show();
						$("#moreinfo").hide();
						$("#relationships").hide();

					});

					$("#moreinfo-tab").live("click", function() {

						$("#gallery").hide();
						$("#moreinfo").show();
						$("#relationships").hide();

					});

					$("#relationships-tab").live("click", function() {

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
						if ($("#profNameTxt").val() == '') {
							alert("Please Enter Name");
						} else {
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
						}

					});

					$("#uploadPhoto").live("click", function() {
						navigator.camera.getPicture(function(imageURI) {
							savePhoto($("#prof-id").val(), imageURI);
							getProfile($("#prof-id").val());
							$("#gallery-tab").trigger('click');
						}, onFail, {
							quality : 50,
							destinationType : destinationType.FILE_URI,
							sourceType : pictureSource.PHOTOLIBRARY
						});
					});
					$("#capturePhoto").live("click", function() {
						navigator.camera.getPicture(function(imageURI) {
							savePhoto($("#prof-id").val(), imageURI);
							getProfile($("#prof-id").val());
							$("#gallery-tab").trigger('click');
						}, onFail, {
							quality : 50,
							allowEdit : true,
							destinationType : destinationType.FILE_URI
						});
					});

					$("#tree-btn")
							.live(
									"click",
									function() {
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
										console.log(json);
										var data = jQuery.parseJSON(json);
										console.log(data);
										var parents = new Array();
										$
												.each(
														data.nodes,
														function(index, item) {
															var node = new primitives.orgdiagram.ItemConfig();
															node.id = item.id;
															node.title = item.name;
															node.description = '';
															node.image = item.img;
															parents[item.id] = node;
															if (item.type == "root") {
																options.rootItem = node;
																options.cursorItem = node;
																options.hasSelectorCheckbox = primitives.common.Enabled.False;
																options.pageFitMode = primitives.orgdiagram.PageFitMode.None;
																options.cursorItem = options.onCursorChanged = function(
																		e, data) {
																	location.href = "#profile";
																	getProfile(data.context.id);
																	$(
																			"#gallery")
																			.hide();
																	$(
																			"#moreinfo")
																			.show();
																	$(
																			"#relationships")
																			.hide();
																	$(
																			"#prof-id")
																			.val(
																					id);
																	$(
																			".txt-view")
																			.show();
																	$(
																			".form-view")
																			.hide();
																};
																$(
																		".basicdiagram")
																		.orgDiagram(
																				options);
															} else if (item.type == "spouse") {
																var parent = parents[item.parent];
																parent.constructor = primitives.orgdiagram.ItemConfig;
																node.itemType = primitives.orgdiagram.ItemType.Adviser;
																node.adviserPlacementType = primitives.orgdiagram.AdviserPlacementType.Right;
																parent.items
																		.push(node);
																$(
																		".basicdiagram")
																		.orgDiagram(
																				"update",
																				primitives.orgdiagram.UpdateMode.Refresh);
															} else {
																var parent = parents[item.parent];
																parent.constructor = primitives.orgdiagram.ItemConfig;
																parent.items
																		.push(node);
																$(
																		".basicdiagram")
																		.orgDiagram(
																				"update",
																				primitives.orgdiagram.UpdateMode.Refresh);
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

function onDeviceReady() {
	pictureSource = navigator.camera.PictureSourceType;
	destinationType = navigator.camera.DestinationType;
}

function onFail(message) {
	alert('Failed because: ' + message);
}
