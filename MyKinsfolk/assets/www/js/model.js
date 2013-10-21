// MODEL PART

function ensureMemberTableExists(tx) {
	tx
			.executeSql("CREATE TABLE IF NOT EXISTS Member (member_id integer primary key autoincrement,name varchar(100),nick varchar(20),birthday date, phone varchar(15),email varchar(50),owner integer);");
}

function ensureNodeTableExists(tx) {
	tx
			.executeSql("CREATE TABLE IF NOT EXISTS Node(node_id integer primary key autoincrement,member_id int,father_node_id int,mother_node_id int,gender int);");
}

function ensureRootTableExists(tx) {
	tx.executeSql("CREATE TABLE IF NOT EXISTS Root(member_id);");
}

function ensureRootTableExists(tx) {
	tx.executeSql("CREATE TABLE IF NOT EXISTS Root(member_id);");
}

function ensurePhotoTableExists(tx){
	tx.executeSql("CREATE TABLE IF NOT EXISTS Photo(id integer primary key autoincrement,member_id integer,img varchar(100),primary_pic integer);");
}

function initDB() {
	var db = window.openDatabase("Kinsfolk", "1.0", "Kinsfolk", 200000);
	try {
		db
				.transaction(function(tx) {
					ensureMemberTableExists(tx);
					var sql = "SELECT * FROM Member where owner=1";
					tx
							.executeSql(
									sql,
									[],
									function(tx, results) {
										var result = (results != null
												&& results.rows != null && results.rows.length > 0);
										if (result) {
											$("#member-btn").removeClass(
													'ui-disabled');
											$("#tree-btn").removeClass(
													'ui-disabled');
											$("#family-btn").removeClass(
													'ui-disabled');

										} else {
											$("#member-btn").addClass(
													'ui-disabled');
											$("#tree-btn").addClass(
													'ui-disabled');
											$("#family-btn").addClass(
													'ui-disabled');
										}
									},
									function(tx, error) {
										console
												.log("Got error in initDB error.code ="
														+ error.code
														+ "error.message = "
														+ error.message);
									});
				});
	} catch (err) {
		console.log("Got error in initDB " + err);
		callback(false);
	}
}

function checkSelf() {
	var db = window.openDatabase("Kinsfolk", "1.0", "Kinsfolk", 200000);
	try {
		db
				.transaction(function(tx) {
					ensureMemberTableExists(tx);
					var sql = "SELECT * FROM Member where owner=1";
					tx
							.executeSql(
									sql,
									[],
									function(tx, results) {
										var result = (results != null
												&& results.rows != null && results.rows.length > 0);
										if (result) {
											var entry = results.rows.item(0);
											var dName = entry.name;
											if (entry.nick != "")
												dName = entry.nick;
											// $("#prof-name").html(
											// "<h3>" + dName
											// + "</h3>");

											$("#prof-name").html(dName);
											$("#profName").html(entry.name);
											$("#profNick").html(entry.nick);
											$("#profBday").html(entry.birthday);
											$("#profPhone").html(entry.phone);
											$("#profEmail").html(entry.email);

											$("#prof-id").val(entry.member_id);
											$("#profNameTxt").val(entry.name);
											$("#profNickTxt").val(entry.nick);
											$("#profBdayTxt").val(
													entry.birthday);
											$("#profPhoneTxt").val(entry.phone);
											$("#profEmailTxt").val(entry.email);

											$("#gallery").hide();
											$("#moreinfo").show();
											$("#activeTab").val(1);
											$("#relationships").hide();
											
											getPhotos(entry.member_id);
											
											location.href = "#profile";

										} else {
											location.href = "#profile-form";
										}
									},
									function(tx, error) {
										console
												.log("Got error in initDB error.code ="
														+ error.code
														+ "error.message = "
														+ error.message);
									});
				});
	} catch (err) {
		console.log("Got error in initDB " + err);
		callback(false);
	}
}

function insertNewMember(data) {
	var db = window.openDatabase("Kinsfolk", "1.0", "Kinsfolk", 200000);
	db
			.transaction(
					function(tx) {
						ensureMemberTableExists(tx);
						var insertStmt = "INSERT INTO Member (name,nick,owner) VALUES ('"
								+ data.name
								+ "','"
								+ data.nick
								+ "',"
								+ data.owner + ")";
						tx
								.executeSql(
										insertStmt,
										[],
										function(tx, results) {
											var nodeData = Object();
											nodeData.member_id = results.insertId;
											if (data.owner == 1) {
												initRoot(results.insertId);
												nodeData.father_id = 0;
												nodeData.mother_id = 0;
												nodeData.gender = data.gender;
												insertToNode(nodeData);
												getProfile(results.insertId);
											} else {
												getGender(
														data.related_id,
														function(sex) {
															if (data.relationship == 1) {
//																getParentsID(data.related_id,function(parents){
//																	if(parents.father_id== 0 && parents.mother_id == 0){
																		nodeData.father_id = 0;
																		nodeData.mother_id = 0;
																		nodeData.gender = 1;

																		var query = "update node set father_node_id="
																				+ nodeData.member_id
																				+ " where member_id="
																				+ data.related_id;
																		insertToNode(nodeData);
																		updateNode(query);
																		updateRoot(nodeData.member_id);
//																	}
//																	
//																});
																
															} else if (data.relationship == 2) {

															} else if (data.relationship == 3 || data.relationship == 4) {
																if (data.relationship == 3)
																	nodeData.gender = 1;
																else
																	nodeData.gender = 2;
																getParentsID(data.related_id,function(parents){
																	if(parents.father_id != 0 || parents.mother_id != 0){
																		nodeData.father_id = parents.father_id;
																		nodeData.mother_id = parents.mother_id;
																		insertToNode(nodeData);
																	}
																	else if(parents.father_id == 0 || parents.mother_id == 0){
																		insertTempFather(function(tmpId){
																			nodeData.father_id = tmpId;
																			nodeData.mother_id = parents.mother_id;
																			insertToNode(nodeData);
																			
																			var tempFather = new Object();
																			tempFather.father_id = 0;
																			tempFather.mother_id = 0;
																			tempFather.gender = 1;
																			tempFather.member_id = tmpId;
																			
																			insertToNode(tempFather);																																					
																			
																			var query = "update node set father_node_id="+tmpId+" where member_id="+data.related_id;
																			updateNode(query);
																			updateRoot(tmpId);
																		});
																		
																		
																	}
																});
																

															} else if (data.relationship == 6
																	|| data.relationship == 7) {
																getSpouseID(
																		data.related_id,
																		sex,
																		function(
																				spouse) {
																			if (data.relationship == 6)
																				nodeData.gender = 1;
																			else
																				nodeData.gender = 2;

																			if (spouse.id != 0) {
																				if (sex == 1) {
																					nodeData.father_id = data.related_id;
																					nodeData.mother_id = spouse.id;
																				} else {
																					nodeData.mother_id = data.related_id;
																					nodeData.father_id = spouse.id;
																				}
																			} else {
																				if (sex == 1) {
																					nodeData.father_id = data.related_id;
																					nodeData.mother_id = 0;
																				} else {
																					nodeData.mother_id = data.related_id;
																					nodeData.father_id = 0;
																				}
																			}
																			console
																					.log(nodeData);
																			insertToNode(nodeData);
																		});

															} else if (data.relationship == 5) {
																nodeData.father_id = 0;
																nodeData.mother_id = 0;
																var query = "";
																if (sex == 1) {
																	nodeData.gender = 2;
																	query = "update node set mother_node_id="
																			+ nodeData.member_id
																			+ " where father_node_id="
																			+ data.related_id;
																} else {
																	nodeData.gender = 1;
																	query = "update node set father_node_id="
																			+ nodeData.member_id
																			+ " where mother_node_id="
																			+ data.related_id;
																}
																insertToNode(nodeData);
																updateNode(query);
															}
														});

											}
										getFamily(results.insertId);	
										});

					}, function(error) {
						console.log("Data insert failed " + error.code + " "
								+ error.message);
					}, function() {
						console.log("Data insert successful");
					});
}

function insertTempFather(callBack){
	var db = window.openDatabase("Kinsfolk", "1.0", "Kinsfolk", 200000);
	db
			.transaction(
					function(tx) {
						ensureNodeTableExists(tx);
						var insertStmt = "insert into member(name,nick) values('Unknown','Unknown')";
						console.log(insertStmt);
						tx.executeSql(insertStmt, [], function(tx, results) {
							callBack(results.insertId);
						});

					}, function(error) {
						console.log("Data insert failed " + error.code + " "
								+ error.message);
					}, function() {
						console.log("Data insert successful");
					});
}

function insertToNode(data) {
	console.log("Inserting to Node");
	var db = window.openDatabase("Kinsfolk", "1.0", "Kinsfolk", 200000);
	db
			.transaction(
					function(tx) {
						ensureNodeTableExists(tx);
						var insertStmt = "insert into node(member_id,father_node_id,mother_node_id,gender) values("
								+ data.member_id
								+ ","
								+ data.father_id
								+ ","
								+ data.mother_id + "," + data.gender + ");";
						console.log(insertStmt);
						tx.executeSql(insertStmt, [], function(tx, results) {

						});

					}, function(error) {
						console.log("Data insert failed " + error.code + " "
								+ error.message);
					}, function() {
						console.log("Data insert successful");
					});
}

function updateNode(query) {
	var db = window.openDatabase("Kinsfolk", "1.0", "Kinsfolk", 200000);
	db.transaction(function(tx) {
		ensureNodeTableExists(tx);
		console.log(query);
		tx.executeSql(query, [], function(tx, results) {

		});

	}, function(error) {
		console.log("Data update failed " + error.code + " " + error.message);
	}, function() {
		console.log("Data update successful");
	});
}

function getAllMembers() {
	console.log("Getting All Members");
	var db = window.openDatabase("Kinsfolk", "1.0", "Kinsfolk", 200000);
	$("#memberList").html("");
	try {
		db
				.transaction(function(tx) {
					ensureMemberTableExists(tx);
					tx
							.executeSql(
									'SELECT * FROM Member',
									[],
									function(tx, results) {
										if (results != null
												&& results.rows != null) {
											for ( var index = 0; index < results.rows.length; index++) {
												var entry = results.rows
														.item(index);
												var dName = entry.name;
												if (entry.nick != "")
													dName = entry.nick;
												$('#memberList')
														.append(
																'<li><a href="#profile" class="details" id="'
																		+ entry.member_id
																		+ '"><img src="img/pic.jpg" class="ul-li-icon" /> <h3>&nbsp;'
																		+ dName
																		+ '</h3></a>');
											}
											$('#memberList')
													.listview('refresh');
										} else {
											$('#memberList')
													.html(
															"<center><h3>No Members Found!</h3></center");
										}
									},
									function(error) {
										console
												.log("Got error fetching Members "
														+ error.code
														+ " "
														+ error.message);
									});
				});
	} catch (err) {
		console.log("Got error while reading Members " + err);
	}
}

function getProfile(memid) {
	var db = window.openDatabase("Kinsfolk", "1.0", "Kinsfolk", 200000);
	$("#memberList").html("");
	try {
		db.transaction(function(tx) {
			ensureMemberTableExists(tx);
			var query = 'SELECT * FROM Member where member_id=' + memid;
			tx.executeSql(query, [], function(tx, results) {
				if (results != null && results.rows != null) {
					for ( var index = 0; index < results.rows.length; index++) {
						var entry = results.rows.item(index);
						var dName = entry.name;
						if (entry.nick != "")
							dName = entry.nick;
						// $("#prof-name").html("<h3>" + dName + "</h3>");
						$("#prof-name").html(dName);
						$("#profName").html(entry.name);
						$("#profNick").html(entry.nick);
						$("#profBday").html(entry.birthday);
						$("#profPhone").html(entry.phone);
						$("#profEmail").html(entry.email);
						$("#prof-id").val(entry.member_id);
						$("#profNameTxt").val(entry.name);
						$("#profNickTxt").val(entry.nick);
						$("#profBdayTxt").val(entry.birthday);
						$("#profPhoneTxt").val(entry.phone);
						$("#profEmailTxt").val(entry.email);
						
						getPhotos(entry.member_id);
					}

				} else {

				}
			}, function(error) {
				console.log("Got error fetching Members " + error.code + " "
						+ error.message);
			});
		});
	} catch (err) {
		console.log("Got error while reading Members " + err);
	}
}

function searchMembers(txt) {
	console.log("Searching");
	var db = window.openDatabase("Kinsfolk", "1.0", "Kinsfolk", 200000);
	$("#memberList").html("");
	try {
		db
				.transaction(function(tx) {
					ensureMemberTableExists(tx);
					var query = "SELECT * FROM Member where name like '%" + txt
							+ "%' or nick like '%" + txt + "%'";
					tx
							.executeSql(
									query,
									[],
									function(tx, results) {
										if (results != null
												&& results.rows != null) {
											for ( var index = 0; index < results.rows.length; index++) {
												var entry = results.rows
														.item(index);
												var dName = entry.name;
												if (entry.nick != "")
													dName = entry.nick;
												$('#memberList')
														.append(
																'<li><a href="#profile" class="details" id="'
																		+ entry.member_id
																		+ '"><img src="img/pic.jpg" class="ul-li-icon" /> <h3>&nbsp;'
																		+ dName
																		+ '</h3></a>');
											}
											$('#memberList')
													.listview('refresh');
										} else {
											$('#memberList')
													.html(
															"<center><h3>No Members Found!</h3></center");
										}
									},
									function(error) {
										console
												.log("Got error fetching Members "
														+ error.code
														+ " "
														+ error.message);
									});
				});
	} catch (err) {
		console.log("Got error while reading Members " + err);
	}
}

function updateMember(data) {
	var db = window.openDatabase("Kinsfolk", "1.0", "Kinsfolk", 200000);
	db.transaction(function(tx) {
		ensureMemberTableExists(tx);
		var insertStmt = "update Member set name='" + data.name + "',nick='"
				+ data.nick + "',birthday='" + data.bday + "',phone='"
				+ data.phone + "',email='" + data.email + "' where member_id="
				+ data.id;
		console.log(insertStmt);
		tx.executeSql(insertStmt, [], function(tx, results) {
			getProfile(data.id);
		});

	}, function(error) {
		console.log("Data update failed " + error.code + " " + error.message);
	}, function() {
		console.log("Data update successful");
	});
}

function initRoot(id) {
	var db = window.openDatabase("Kinsfolk", "1.0", "Kinsfolk", 200000);
	db.transaction(function(tx) {
		ensureRootTableExists(tx);
		var insertStmt = "insert into Root(member_id) values(" + id + ")";
		// console.log(insertStmt);
		tx.executeSql(insertStmt, [], function(tx, results) {
		});

	}, function(error) {
		console.log("Data insert failed " + error.code + " " + error.message);
	}, function() {
		console.log("Data insert successful");
	});
}

function updateRoot(id) {
	var db = window.openDatabase("Kinsfolk", "1.0", "Kinsfolk", 200000);
	db.transaction(function(tx) {
		ensureRootTableExists(tx);
		var insertStmt = "update Root set member_id=" + id;
		console.log(insertStmt);
		tx.executeSql(insertStmt, [], function(tx, results) {

		});

	}, function(error) {
		console.log("Data update failed " + error.code + " " + error.message);
	}, function() {
		console.log("Data update successful");
	});
}

function getTree() {
	console.log("Getting Tree Nodes");
	var db = window.openDatabase("Kinsfolk", "1.0", "Kinsfolk", 200000);
	try {
		db
				.transaction(function(tx) {
					ensureNodeTableExists(tx);
					ensureRootTableExists(tx);
					var query = "SELECT * FROM Member m join Root r on m.member_id=r.member_id";
					tx.executeSql(query, [], function(tx, results) {
						var member = new Object();
						if (results != null && results.rows != null) {
							if(results.rows.length > 0){
								var entry = results.rows.item(0);
								var dName = entry.name;
								if (entry.nick != "")
									dName = entry.nick;
								html = '<li>{"id":"' + entry.member_id
										+ '","node_id":"' + entry.member_id
										+ '","name":"' + dName
										+ '","parent":"0","type":"root"}</li>';
								$(".tree-root").append(html);
								getSpouse(entry.member_id, 1);
								getChildren(entry.member_id, 1);
							}							
						}
					}, function(error) {
						console.log("Got error fetching Members " + error.code
								+ " " + error.message);
					});
				});
	} catch (err) {
		console.log("Got error while reading Members " + err);
	}
}

function getSpouseID(id, sex, callBack) {
	var db = window.openDatabase("Kinsfolk", "1.0", "Kinsfolk", 200000);
	try {
		db
				.transaction(function(tx) {
					ensureRootTableExists(tx);
					if (sex == 1)
						var query = "select * from member where member_id=(select mother_node_id from node where father_node_id="
								+ id + ")";
					else
						var query = "select * from member where member_id=(select father_node_id from node where mother_node_id="
								+ id + ")";
					tx.executeSql(query, [], function(tx, results) {
						var data = new Object();
						if (results != null && results.rows != null) {
							if (results.rows.length > 0) {
								var entry = results.rows.item(0);
								data.gender = entry.gender;
								data.id = entry.member_id;
							} else {
								data.id = 0;
								data.gender = 0;
							}
						}
						callBack(data);
					}, function(error) {
						console.log("Got error fetching Members " + error.code
								+ " " + error.message);
					});
				});
	} catch (err) {
		console.log("Got error while reading Members " + err);
	}
}

function getParentsID(id, callBack) {
	var db = window.openDatabase("Kinsfolk", "1.0", "Kinsfolk", 200000);
	try {
		db.transaction(function(tx) {
			ensureRootTableExists(tx);
			var query = "Select * from node where member_id="+id;
			tx.executeSql(query, [], function(tx, results) {
				var data = new Object();
				if (results != null && results.rows != null) {
					if (results.rows.length > 0) {
						var entry = results.rows.item(0);
						data.father_id = entry.father_node_id;
						data.mother_id = entry.mother_node_id;
					} 
				}
				callBack(data);
			}, function(error) {
				console.log("Got error fetching Members " + error.code + " "
						+ error.message);
			});
		});
	} catch (err) {
		console.log("Got error while reading Members " + err);
	}
}

function getSpouse(id, view, callBack) {
	console.log("Getting Spouse of "+id);
	getGender(
			id,
			function(sex) {
				var db = window.openDatabase("Kinsfolk", "1.0", "Kinsfolk",
						200000);
				try {
					db
							.transaction(function(tx) {
								ensureRootTableExists(tx);
								if (sex == 1)
									var query = "select * from member where member_id=(select mother_node_id from node where father_node_id="
											+ id + ")";
								else
									var query = "select * from member where member_id=(select father_node_id from node where mother_node_id="
											+ id + ")";
								tx
										.executeSql(
												query,
												[],
												function(tx, results) {
													if (results != null
															&& results.rows != null) {
														if (results.rows.length > 0) {
															var entry = results.rows
																	.item(0);
															var dName = entry.name;
															if (entry.nick != "")
																dName = entry.nick;
															if (view == 1) {
																html = '<li>{"id":"'
																		+ entry.member_id
																		+ '","node_id":"'
																		+ entry.member_id
																		+ '","name":"'
																		+ dName
																		+ '","parent":"'
																		+ id
																		+ '","type":"spouse"}</li>';
																$(".tree-root")
																		.append(
																				html);
															} else {
																if (sex == 1)
																	relationship = "Wife";
																else
																	relationship = "Husband";
																$('#familyList')
																		.append(
																				'<li><a href="#profile" class="details" id="'
																						+ entry.member_id
																						+ '"><!--<img src="" class="ul-li-icon" />--> <h3>&nbsp;'
																						+ dName
																						+ '</h3><p>'
																						+ relationship
																						+ '</p></a>');
																$('#familyList')
																		.listview(
																				'refresh');
															}

														}

													}
												},
												function(error) {
													console
															.log("Got error fetching Members "
																	+ error.code
																	+ " "
																	+ error.message);
												});
							});
				} catch (err) {
					console.log("Got error while reading Members " + err);
				}
			});
}

function getChildren(id, view) {
	console.log("Getting Children of "+id);
	getGender(
			id,
			function(sex) {
				var db = window.openDatabase("Kinsfolk", "1.0", "Kinsfolk",
						200000);
				try {
					db
							.transaction(function(tx) {
								if (sex == 1)
									var query = "SELECT * FROM Member m join Node n on m.member_id=n.member_id where n.father_node_id="
											+ id;
								else
									var query = "SELECT * FROM Member m join Node n on m.member_id=n.member_id where n.mother_node_id="
											+ id;
								tx
										.executeSql(
												query,
												[],
												function(tx, results) {
													if (results != null
															&& results.rows != null) {
														for ( var index = 0; index < results.rows.length; index++) {
															var entry = results.rows
																	.item(index);
															var dName = entry.name;
															if (entry.nick != "")
																dName = entry.nick;
															if (view == 1) {
																html = '<li>{"id":"'
																		+ entry.member_id
																		+ '","node_id":"'
																		+ entry.member_id
																		+ '","name":"'
																		+ dName
																		+ '","parent":"'
																		+ id
																		+ '","type":"node"}</li>';
																$(".tree-root")
																		.append(
																				html);
																getSpouse(entry.member_id,1);
																getChildren(entry.member_id,1);
															} else {
																if (entry.gender == 1)
																	relationship = "Son";
																else
																	relationship = "Daughter";
																$('#familyList')
																		.append(
																				'<li><a href="#profile" class="details" id="'
																						+ entry.member_id
																						+ '"><!--<img src="" class="ul-li-icon" />--> <h3>&nbsp;'
																						+ dName
																						+ '</h3><p>'
																						+ relationship
																						+ '</p></a>');
															}

														}
														if (view == 2) {
															$('#familyList')
																	.listview(
																			'refresh');
														}

													}
												},
												function(error) {
													console
															.log("Got error fetching Members "
																	+ error.code
																	+ " "
																	+ error.message);
												});
							});
				} catch (err) {
					console.log("Got error while reading Members " + err);
				}
			});
}

function getFamily(id) {
	console.log("Getting Relationship");
	var db = window.openDatabase("Kinsfolk", "1.0", "Kinsfolk", 200000);
	$("#familyList").html("");
	try {
		db
				.transaction(function(tx) {
					ensureNodeTableExists(tx);
					var query = "select * from (select * from member m join node n on n.member_id=m.member_id where m.member_id=(select father_node_id from node where member_id="
							+ id
							+ ")) union select * from member m join node n on n.member_id=m.member_id where m.member_id=(select mother_node_id from node where member_id="
							+ id + ")";
					console.log(query);
					tx
							.executeSql(
									query,
									[],
									function(tx, results) {
										if (results != null
												&& results.rows != null) {
											for ( var index = 0; index < results.rows.length; index++) {
												var entry = results.rows
														.item(index);
												var dName = entry.name;
												if (entry.nick != "")
													dName = entry.nick;
												if (entry.gender == 1)
													relationship = "Father";
												else
													relationship = "Mother";
												if(dName != "Unknown"){
													$('#familyList')
													.append(
															'<li><a href="#profile" class="details" id="'
																	+ entry.member_id
																	+ '"><img src="img/pic.jpg" class="ul-li-icon" /> <h3>&nbsp;'
																	+ dName
																	+ '</h3><p>'
																	+ relationship
																	+ '</p></a>');
												}
												
											}
											$('#familyList')
													.listview('refresh');
										}
										getSpouse(id, 2);
										getChildren(id, 2);
									},
									function(error) {
										console
												.log("Got error fetching Family "
														+ error.code
														+ " "
														+ error.message);
									});
				});
	} catch (err) {
		console.log("Got error while reading Members " + err);
	}
}

function getGender(id, callBack) {
	var db = window.openDatabase("Kinsfolk", "1.0", "Kinsfolk", 200000);
	try {
		db.transaction(function(tx) {
			ensureRootTableExists(tx);
			var query = "SELECT * FROM node where member_id=" + id;
			tx.executeSql(query, [], function(tx, results) {
				var member = new Object();
				if (results != null && results.rows != null) {
					var entry = results.rows.item(0);

					callBack(entry.gender);
				}
			}, function(error) {
				console.log("Got error fetching Gender " + error.code + " "
						+ error.message);
			});
		});
	} catch (err) {
		console.log("Got error while reading Members " + err);
	}
}

function savePhoto(id,photo){
	var db = window.openDatabase("Kinsfolk", "1.0", "Kinsfolk", 200000);
	db.transaction(function(tx) {
		ensurePhotoTableExists(tx);
		var insertStmt = "insert into Photo(member_id,img,primary_pic) values("+id+",'"+photo+"',0)";
		// console.log(insertStmt);
		tx.executeSql(insertStmt, [], function(tx, results) {
		});

	}, function(error) {
		console.log("Data insert failed " + error.code + " " + error.message);
	}, function() {
		console.log("Data insert successful");
	});
}

function getPhotos(id){
	var db = window.openDatabase("Kinsfolk", "1.0", "Kinsfolk", 200000);
	try {
		db.transaction(function(tx) {
			ensurePhotoTableExists(tx);
			var query = "SELECT img FROM Photo where member_id=" + id;
			tx.executeSql(query, [], function(tx, results) {
				$(".gallery-thumbs").html("");
				var member = new Object();
				if (results != null && results.rows != null) {
					for ( var index = 0; index < results.rows.length; index++) {
						var entry = results.rows.item(0);
						$(".gallery-thumbs")
						.append("<li><img src="+entry.img+" width=75 height=75></li>");
					}
				}
			}, function(error) {
				console.log("Got error fetching Gender " + error.code + " "
						+ error.message);
			});
		});
	} catch (err) {
		console.log("Got error while reading Members " + err);
	}
}
