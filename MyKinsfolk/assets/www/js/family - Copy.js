$(window)
		.load(
				function() {
					setTreeSize();
					var options = new primitives.orgdiagram.Config();
					var rootItem = new primitives.orgdiagram.ItemConfig();

					function initRoot() {
						// some methods to query for root
						// rootItem = new primitives.orgdiagram.ItemConfig();
						rootItem.title = "User1";
						rootItem.description = '';
						options.rootItem = rootItem;
						options.cursorItem = rootItem;
						options.hasSelectorCheckbox = primitives.common.Enabled.False;
						$(".basicdiagram").orgDiagram(options);
					}
					var allItems = '{"nodes":[{"id":1,"node_id":"node_1","name":"Member1","description":"","parent":0},{"id":2,"node_id":"node_2","name":"Member2","description":"","parent":1},{"id":3,"node_id":"node_3","name":"Member3","description":"","parent":1},{"id":4,"node_id":"node_4","name":"Member4","description":"","parent":1},{"id":5,"node_id":"node_5","name":"Member5","description":"","parent":2}]}';
					$("#view-btn")
							.click(
									function() {
										console.log("adding");
										initRoot();
										var parents = new Array();
										parents[1] = rootItem;
										var data = jQuery.parseJSON(allItems);
										console.log(data.nodes.length);
										$
												.each(
														data.nodes,
														function(index, item) {
															if (item.parent != 0
																	|| item.parent != '') {
																var node = new primitives.orgdiagram.ItemConfig();
																node.title = item.name;
																node.description = item.description;
																parents[item.id] = node;
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

					function setTreeSize() {
						var width = window.innerWidth;
						var height = window.innerHeight - 50;
						$(".basicdiagram").width(width);
						$(".basicdiagram").height(height);
					}

				});

//MODEL PART

function ensureMotherTableExists(tx) {
	tx
			.executeSql('CREATE TABLE IF NOT EXISTS MotherTree (id unique,name,parent_id,photo,phone,facebook)');
}

function ensureFatherTableExists(tx) {
	tx
			.executeSql('CREATE TABLE IF NOT EXISTS FatherTree (id unique,name,parent_id,photo,phone,facebook)');
}

function getFatherTree(){
	var db = window.openDatabase("FamilyTree", "1.0", "FatherTree", 200000);
	try {
		db.transaction(function (tx) {
			tx.executeSql('SELECT * FROM FatherTree', [], function (tx, results) {					
				if (results != null && results.rows != null) {					
					for (var index = 0; index < results.rows.length; index++) {
						var entry = results.rows.item(index)
						
					}
					
				}else{
					
				}
			}, function (error) {
					console.log("Got error fetching tree " + error.code + " " + error.message);
				});
		});
	} catch (err) {
		console.log("Got error while reading favorites " + err);
	}
}