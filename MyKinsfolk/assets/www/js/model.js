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
	tx
			.executeSql("CREATE TABLE IF NOT EXISTS Root(member_id);");
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
											//											$("#prof-name").html(
											//													"<h3>" + dName
											//															+ "</h3>");

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
	db.transaction(function(tx) {
		ensureMemberTableExists(tx);
		var insertStmt = "INSERT INTO Member (name,nick,owner) VALUES ('"
				+ data.name + "','" + data.nick + "'," + data.owner + ")";
		tx.executeSql(insertStmt, [], function(tx, results) {
			if(owner = 1)
				initRoot(results.insertId);
			getProfile(results.insertId);			
		});

	}, function(error) {
		console.log("Data insert failed " + error.code + " " + error.message);
	}, function() {
		console.log("Data insert successful");
	});
}

function insertToNode(data) {
	var db = window.openDatabase("Kinsfolk", "1.0", "Kinsfolk", 200000);
	db.transaction(function(tx) {
		ensureMemberTableExists(tx);
		var insertStmt = "INSERT INTO Member (name,nick,owner) VALUES ('"
				+ name + "','" + data.nick + "'," + data.owner + ")";
		// console.log(insertStmt);
		tx.executeSql(insertStmt, [], function(tx, results) {
			getProfile(results.insertId);
		});

	}, function(error) {
		console.log("Data insert failed " + error.code + " " + error.message);
	}, function() {
		console.log("Data insert successful");
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
																		+ '"><!--<img src="" class="ul-li-icon" />--> <h3>&nbsp;'
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
						//$("#prof-name").html("<h3>" + dName + "</h3>");
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
																		+ '"><!--<img src="" class="ul-li-icon" />--> <h3>&nbsp;'
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

function initRoot(id){		
	var db = window.openDatabase("Kinsfolk", "1.0", "Kinsfolk", 200000);
	db.transaction(function(tx) {
		ensureRootTableExists(tx);
		var insertStmt = "insert into Root(member_id) values("+id+")";
		//console.log(insertStmt);
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
		var insertStmt = "update Root set member_id="+id;
		console.log(insertStmt);
		tx.executeSql(insertStmt, [], function(tx, results) {
							
		});

	}, function(error) {
		console.log("Data update failed " + error.code + " " + error.message);
	}, function() {
		console.log("Data update successful");
	});
}

function getTree(){
	console.log("Getting Tree Nodes");
	var db = window.openDatabase("Kinsfolk", "1.0", "Kinsfolk", 200000);	
	try {
		db
				.transaction(function(tx) {
					ensureRootTableExists(tx);
					var query = "SELECT * FROM Member m join Root r on m.member_id=r.member_id";
					tx
							.executeSql(
									query,
									[],
									function(tx, results) {
										var member = new Object();
										if (results != null
												&& results.rows != null) {
											
												var entry = results.rows
														.item(0);
												html='<li>{"id":"'+entry.member_id+'","node_id":"'+entry.member_id+'","name":"'+entry.name+'","parent":"0","type":"root"}</li>';
												$(".tree-root").append(html);
												getSpouse(entry.member_id);
												getChildren(entry.member_id);
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

//function getNode(id,callback){
//	var db = window.openDatabase("Kinsfolk", "1.0", "Kinsfolk", 200000);	
//	try {
//		db
//				.transaction(function(tx) {
//					ensureNodeTableExists(tx);
//					var query = "select node_id,m.member_id,m.name,m.nick from node n join member m on n.member_id=m.member_id where m.member_id="+id;
//					tx
//							.executeSql(
//									query,
//									[],
//									function(tx, results) {
//										var member = new Object();
//										if (results != null
//												&& results.rows != null) {
//											
//												var entry = results.rows
//														.item(0);
//												
//												member.name = entry.name;
//												member.member_id = entry.member_id;
//												
//											
//										} else {
//											member.name = "";
//											member.member_id = 0;
//										}
//										callBack(member);									
//									},
//									function(error) {
//										console
//												.log("Got error fetching Members "
//														+ error.code
//														+ " "
//														+ error.message);
//									});
//				});
//	} catch (err) {
//		console.log("Got error while reading Members " + err);
//	}
//}

function getSpouse(id){
	var db = window.openDatabase("Kinsfolk", "1.0", "Kinsfolk", 200000);	
	try {
		db
				.transaction(function(tx) {
					ensureRootTableExists(tx);
					var query = "select * from member where member_id=(select mother_node_id from node where father_node_id="+id+")";
					tx
							.executeSql(
									query,
									[],
									function(tx, results) {
										if (results != null
												&& results.rows != null) {
											if(results.rows.length > 0){
												var entry = results.rows
												.item(0);
												html ='<li>{"id":"'+entry.member_id+'","node_id":"'+entry.member_id+'","name":"'+entry.name+'","parent":"'+id+'","type":"spouse"}</li>';
												$(".tree-root").append(html);
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
}

function getChildren(id){
	var db = window.openDatabase("Kinsfolk", "1.0", "Kinsfolk", 200000);	
	try {
		db
				.transaction(function(tx) {
					var query = "SELECT * FROM Member m join Node n on m.member_id=n.member_id where n.father_node_id="+id;
					tx
							.executeSql(
									query,
									[],
									function(tx, results) {										
										if (results != null
												&& results.rows != null) {
											for ( var index = 0; index < results.rows.length; index++) {
												var entry = results.rows.item(index);
												html ='<li>{"id":"'+entry.member_id+'","node_id":"'+entry.member_id+'","name":"'+entry.name+'","parent":"'+id+'","type":"node"}</li>';
												$(".tree-root").append(html);
												getSpouse(entry.member_id);
												getChildren(entry.member_id);
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
}
