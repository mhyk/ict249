// MODEL PART

function ensureMemberTableExists(tx) {
	tx
			.executeSql("CREATE TABLE IF NOT EXISTS Member (member_id integer primary key autoincrement,name varchar(100),nick varchar(20),owner integer);");
}

function ensureNodeTableExists(tx) {
	tx
			.executeSql("CREATE TABLE IF NOT EXISTS Node(node_id integer primary key autoincrement,member_id int,parent_id int,gender int);");
}

function ensureMarriageTableExists(tx) {
	tx
			.executeSql("CREATE TABLE IF NOT EXISTS Marriage(husband_id,wife_id, primary key(husband_id,wife_id);");
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
											var entry = results.rows
													.item(0);
											var dName = entry.name;
											if (entry.nick != "")
												dName = entry.nick;
//											$("#prof-name").html(
//													"<h3>" + dName
//															+ "</h3>");
											
											$("#prof-name").html(dName);
											
											$("#gallery").hide();
											$("#moreinfo").show();
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
	db
			.transaction(
					function(tx) {
						ensureMemberTableExists(tx);
						var insertStmt = "INSERT INTO Member (name,nick,owner) VALUES ('"
								+ data.name
								+ "','"								
								+ data.nick + "'," + data.owner + ")";
						// console.log(insertStmt);
						tx.executeSql(insertStmt, [], function(tx, results) {
							getProfile(results.insertId);
						});

					}, function(error) {
						console.log("Data insert failed " + error.code + " "
								+ error.message);
					}, function() {
						console.log("Data insert successful");
					});
}

function insertToNode(data){
	var db = window.openDatabase("Kinsfolk", "1.0", "Kinsfolk", 200000);
	db
			.transaction(
					function(tx) {
						ensureMemberTableExists(tx);
						var insertStmt = "INSERT INTO Member (name,nick,owner) VALUES ('"
								+ name
								+ "','"
								+ data.nick + "'," + data.owner + ")";
						// console.log(insertStmt);
						tx.executeSql(insertStmt, [], function(tx, results) {
							getProfile(results.insertId);
						});

					}, function(error) {
						console.log("Data insert failed " + error.code + " "
								+ error.message);
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
					var query = "SELECT * FROM Member where name like '%"+txt+"%' or nick like '%"+txt+"%'";
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