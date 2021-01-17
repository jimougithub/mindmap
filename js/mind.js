var _jm = null;
var _author = "";

function open_json(src){	
	var options = {
		container:'jsmind_container',
		editable:true,
		theme:'greensea'
	}
	if (src){
		_jm = jsMind.show(options,src);
	} else {
		var mind = {"meta":{"name":"jsMind","author":"examplecodebook.com","version":"0.4.6"},"format":"node_array","data":[{"id":"root","topic":"Example","expanded":true,"isroot":true}]};
		_jm = jsMind.show(options,mind);
	}	
}

function open_ajax(mind_url){
	//var mind_url = 'data_example.json';
	jsMind.util.ajax.get(mind_url,function(mind){
		_jm.show(mind);
	});
}

function screen_shot(){
	_jm.screenshot.shootDownload();
}

function show_data(){
	var mind_data = _jm.get_data();
	var mind_string = jsMind.util.json.json2string(mind_data);
	prompt_info(mind_string);
}

function save_file(){
	var mind_data = _jm.get_data();
	var mind_name = mind_data.data[0].topic;	//change the file name as root name
	var mind_str = jsMind.util.json.json2string(mind_data);
	jsMind.util.file.save(mind_str,'text/jsmind',mind_name+'.treenode.jm');		//include treenode as file name
}

function click_open_file(){
	var file_input = document.getElementById('file_input');
	file_input.click();
}

function click_open_nodearray(){
	var file_input = document.getElementById('file_input_nodearray');
	file_input.click();
}

function click_open_freemind(){
	var file_input = document.getElementById('file_input_freemind');
	file_input.click();
}

function open_file(){
	var file_input = document.getElementById('file_input');
	var files = file_input.files;
	if(files.length > 0){
		var file_data = files[0];
		jsMind.util.file.read(file_data,function(jsmind_data, jsmind_name){
			var mind = jsMind.util.json.string2json(jsmind_data);
			if(!!mind){
				_jm.show(mind);
			}else{
				prompt_info('can not open this file as mindmap');
			}
		});
	}else{
		prompt_info('please choose a file first')
	}
}

function select_node(){
	var nodeid = 'other';
	_jm.select_node(nodeid);
}

function show_selected(){
	var selected_node = _jm.get_selected_node();
	if(!!selected_node){
		prompt_info(selected_node.topic);
	}else{
		prompt_info('nothing');
	}
}

function get_selected_nodeid(){
	var selected_node = _jm.get_selected_node();
	if(!!selected_node){
		return selected_node.id;
	}else{
		return null;
	}
}

function add_node(){
	var selected_node = _jm.get_selected_node(); // as parent of new node
	if(!selected_node){prompt_info('please select a node first.');return;}

	var nodeid = "jm_" + jsMind.util.uuid.newid();
	var topic = 'New Node';
	var node = _jm.add_node(selected_node, nodeid, topic);
}

var imageChooser = document.getElementById('image-chooser');

imageChooser.addEventListener('change', function (event) {
	// Read file here.
	var reader = new FileReader();
	reader.onloadend = (function () {
		var selected_node = _jm.get_selected_node();
		var nodeid = jsMind.util.uuid.newid();
		var topic = "New node";
		var data = {
			"background-image": reader.result,
			"width": "100",
			"height": "100"};
		var node = _jm.add_node(selected_node, nodeid, topic, data);
	});

	var file = imageChooser.files[0];
	if (file) {
		reader.readAsDataURL(file);
	};

}, false);

function add_image_node(){
	var selected_node = _jm.get_selected_node(); // as parent of new node
	if(!selected_node){
		prompt_info('please select a node first.');
		return;
	}

	imageChooser.focus();
	imageChooser.click();
}

function modify_node(){
	var selected_id = get_selected_nodeid();
	if(!selected_id){prompt_info('please select a node first.');return;}

	// modify the topic
	_jm.update_node(selected_id, '--- modified ---');
}

function move_to_first(){
	var selected_id = get_selected_nodeid();
	if(!selected_id){prompt_info('please select a node first.');return;}

	_jm.move_node(selected_id,'_first_');
}

function move_to_last(){
	var selected_id = get_selected_nodeid();
	if(!selected_id){prompt_info('please select a node first.');return;}

	_jm.move_node(selected_id,'_last_');
}

function move_node(){
	// move a node before another
	_jm.move_node('other','open');
}

function remove_node(){
	var selected_id = get_selected_nodeid();
	if(!selected_id){prompt_info('please select a node first.');return;}

	_jm.remove_node(selected_id);
}

function edit_node(){
	var selected_id = get_selected_nodeid();
	if(!selected_id){prompt_info('please select a node first.');return;}

	_jm.begin_edit(selected_id);
}

function increase_text_font_size(){
	var selected_id = get_selected_nodeid();
	if(!selected_id){prompt_info('please select a node first.');return;}
	
	var new_size = _jm.get_node_font_size(selected_id)+1;
	if (new_size < 100){
		_jm.set_node_font_style(selected_id, new_size);
	}
}

function decrease_text_font_size(){
	var selected_id = get_selected_nodeid();
	if(!selected_id){prompt_info('please select a node first.');return;}
	
	var new_size = _jm.get_node_font_size(selected_id)-1;
	if (new_size > 0){
		_jm.set_node_font_style(selected_id, new_size);
	}
}

var selected_id_color;

$("#color-picker-bg").spectrum({
	color: "#1abc9c",
	flat: true,
	showInput: true,
	move: function(color) {
		_jm.set_node_color(selected_id_color, color.toHexString(), null);
	},
	change: function(color) {
		$("#bgColorPickerDiv").hide();
		$("#color-picker-bg").spectrum("set", "#1abc9c");
    }
});

$("#color-picker-text").spectrum({
	color: "#fff",
	flat: true,
	showInput: true,
	move: function(color) {
		_jm.set_node_color(selected_id_color, null, color.toHexString());
	},
	change: function(color) {
		$("#textColorPickerDiv").hide();
		$("#color-picker-text").spectrum("set", "#fff");
    }
});

function change_text_color(){
	selected_id_color = get_selected_nodeid();
	if(!selected_id_color){prompt_info('please select a node first.');return;}

	$("#textColorPickerDiv").show();
}

function change_background_color(){
	selected_id_color = get_selected_nodeid();
	if(!selected_id_color){prompt_info('please select a node first.');return;}

	$("#bgColorPickerDiv").show();
}

var imageChooserChange = document.getElementById('image-chooser-change');

imageChooserChange.addEventListener('change', function (event) {
	// Read file here.
	var reader = new FileReader();
	reader.onloadend = (function () {
		var selected_id = get_selected_nodeid();
		_jm.set_node_background_image(selected_id, reader.result, 100, 100);
	});

	var file = imageChooserChange.files[0];
	if (file) {
		reader.readAsDataURL(file);
	};
}, false);

function change_background_image(){
	var selected_id = get_selected_nodeid();
	if(!selected_id){prompt_info('please select a node first.');return;}

	imageChooserChange.focus();
	imageChooserChange.click();
}

function remove_background_image(){
	var selected_id = get_selected_nodeid();
	if(!selected_id){prompt_info('please select a node first.');return;}

	_jm.remove_node_background_image(selected_id);
}

function set_theme(theme_name){
	_jm.set_theme(theme_name);
}

var zoomInButton = document.getElementById("zoom-in-button");
var zoomOutButton = document.getElementById("zoom-out-button");

function zoomIn() {
	if (_jm.view.zoomIn()) {
		zoomOutButton.disabled = false;
	} else {
		zoomInButton.disabled = true;
	};
};

function zoomOut() {
	if (_jm.view.zoomOut()) {
		zoomInButton.disabled = false;
	} else {
		zoomOutButton.disabled = true;
	};
};

function toggle_editable(btn){
	var editable = _jm.get_editable();
	if(editable){
		_jm.disable_edit();
		btn.innerHTML = 'enable editable';
	}else{
		_jm.enable_edit();
		btn.innerHTML = 'disable editable';
	}
}

// this method change size of container, perpare for adjusting jsmind
function change_container(){
	var c = document.getElementById('jsmind_container');
	c.setAttribute("style","display:block;width:100vw;height:100vh");
	resize_jsmind();
}

function resize_jsmind(){
	_jm.resize();
}

function expand(){
	var selected_id = get_selected_nodeid();
	if(!selected_id){prompt_info('please select a node first.');return;}

	_jm.expand_node(selected_id);
}

function collapse(){
	var selected_id = get_selected_nodeid();
	if(!selected_id){prompt_info('please select a node first.');return;}

	_jm.collapse_node(selected_id);
}

function toggle(){
	var selected_id = get_selected_nodeid();
	if(!selected_id){prompt_info('please select a node first.');return;}

	_jm.toggle_node(selected_id);
}

function expand_all(){
	_jm.expand_all();
}

function expand_to_level2(){
	_jm.expand_to_depth(2);
}

function expand_to_level3(){
	_jm.expand_to_depth(3);
}

function collapse_all(){
	_jm.collapse_all();
}

function get_nodearray_data(){
	var mind_data = _jm.get_data('node_array');
	var mind_string = jsMind.util.json.json2string(mind_data);
	prompt_info(mind_string);
}

function save_nodearray_file(){
	var mind_data = _jm.get_data('node_array');
	var mind_name = mind_data.data[0].topic;	//change the file name as root name
	var mind_str = jsMind.util.json.json2string(mind_data);
	jsMind.util.file.save(mind_str,'text/jsmind',mind_name+'.nodearray.jm');		//include nodearry as file name
}

function open_nodearray(){
	var file_input = document.getElementById('file_input_nodearray');
	var files = file_input.files;
	if(files.length > 0){
		var file_data = files[0];
		jsMind.util.file.read(file_data,function(jsmind_data, jsmind_name){
			var mind = jsMind.util.json.string2json(jsmind_data);
			if(!!mind){
				_jm.show(mind);
			}else{
				prompt_info('can not open this file as mindmap');
			}
		});
	}else{
		prompt_info('please choose a file first')
	}
}

function get_freemind_data(){
	var mind_data = _jm.get_data('freemind');
	var mind_string = jsMind.util.json.json2string(mind_data);
	alert(mind_string);
}

function save_freemind_file(){
	var mind_data = _jm.get_data('freemind');
	var mind_name = mind_data.data[0].topic;	//change the file name as root name
	var mind_str = mind_data.data;
	jsMind.util.file.save(mind_str,'text/xml',mind_name+'.mm');
}

function open_freemind(){
	var file_input = document.getElementById('file_input_freemind');
	var files = file_input.files;
	if(files.length > 0){
		var file_data = files[0];
		jsMind.util.file.read(file_data, function(freemind_data, freemind_name){
			if(freemind_data){
				var mind_name = freemind_name;
				if(/.*\.mm$/.test(mind_name)){
					mind_name = freemind_name.substring(0,freemind_name.length-3);
				}
				var mind = {
					"meta":{
						"name":mind_name,
						"author":"hizzgdev@163.com",
						"version":"1.0.1"
					},
					"format":"freemind",
					"data":freemind_data
				};
				_jm.show(mind);
			}else{
				prompt_info('can not open this file as mindmap');
			}
		});
	}else{
		prompt_info('please choose a file first')
	}
}

function prompt_info(msg){
	show_notify("Error", msg, "error");
}

// Trigger action when the contexmenu is about to be shown
$(document).bind("contextmenu", function (event) {
    // Avoid the real one
	event.preventDefault();
	
    // Show contextmenu
    $(".custom-menu").finish().toggle(100).
    
    // In the right position (the mouse)
    css({
        top: event.pageY + "px",
        left: event.pageX + "px"
	});

	// Move other divs
	move_textColorPickerDiv(event);
	move_bgColorPickerDiv(event);
});

// Trigger action when the contexmenu is about to be shown
function move_textColorPickerDiv(event) {
    var el = document.getElementById('textColorPickerDiv');
	el.style.position = 'absolute';
	el.style.left = event.pageX + "px";
	el.style.top = event.pageY + "px";
	el.style.zIndex = 1001;
}
function move_bgColorPickerDiv(event) {
    var el = document.getElementById('bgColorPickerDiv');
	el.style.position = 'absolute';
	el.style.left = event.pageX + "px";
	el.style.top = event.pageY + "px";
	el.style.zIndex = 1001;
}

// If the document is clicked somewhere
$(document).bind("mousedown", function (e) {
    // If the clicked element is not the menu
    if (!$(e.target).parents(".custom-menu").length > 0) {
        // Hide it
        $(".custom-menu").hide(100);
    }
});

// If the menu element is clicked
$(".custom-menu li").click(function(){   
	// This is the triggered action name
	var action_code = $(this).attr("data-action");
    switch(action_code) {
		// A case for each action. Your actions here
		case "edit_node": edit_node(); break;
        case "add_node": add_node(); break;
        case "del_node": remove_node(); break;
		case "add_image_node": add_image_node(); break;
		case "zoom_in": zoomIn(); break;
		case "zoom_out": zoomOut(); break;
		case "expand_all": expand_all(); break;
		case "collapse_all": collapse_all(); break;
		case "click_open_file": click_open_file(); break;
		case "save_file": save_file(); break;
		case "click_open_nodearray": click_open_nodearray(); break;
		case "save_nodearray_file": save_nodearray_file(); break;
		case "click_open_freemind": click_open_freemind(); break;
		case "save_freemind_file": save_freemind_file(); break;
		case "change_background_image": change_background_image(); break;
		case "remove_background_image": remove_background_image(); break;
		case "change_background_color": change_background_color(); break;
		case "change_text_color": change_text_color(); break;
		case "increase_text_font_size": increase_text_font_size(); break;
		case "decrease_text_font_size": decrease_text_font_size(); break;
		case "screen_shot": screen_shot(); break;
		case "save_online": save_online(); break;
		default:
			if (action_code && action_code.substring(0, 6) =="theme_"){
				set_theme(action_code.substring(6));
			}
    }
    // Hide it AFTER the action was triggered
    $(".custom-menu").hide(100);
});

//Check login status
function check_login_status(showerror){
	userSession=getCookie("usersession");
	if (userSession==null || userSession==""){
		if (showerror){
			show_notify("Error", "Please login first", "error");
		}
		return false;
	} else {
		return true;
	}
}

//Load language mind
function load_language_mind(langid){
	$.ajax({
		url: "../api/mind/",
		type: "POST",
		dataType: "json",
		data: JSON.stringify({
			action : "view",
			mindid : langid
		}),
		success: function(json){
			var codemap = false;
			var mind_data = string2json(json.src);
			if (json.data[0]){
				_author = json.data[0].author;
			} else {
				_author = "";
			}	
			$.each(json.code, function(i,v){
				codemap = true;
				// if codeid not being add to jsMind, add the example code to root
				var index = -1;
				for (var i = 0; i < mind_data.data.length; ++i) {
					if (mind_data.data[i].id == v.codeid) {
						index = i;
						break;
					}
				}
				//if (mind_data.data.findIndex(x => x.id === v.codeid)<0){
				if (index<0){
					mind_data.data.push({"id":v.codeid,"topic":v.codename,"parentid":langid});
				}
			});
			// add a href link to show code
			if (codemap) {
				mind_data.data.forEach(function (item, index) {
					if (index>0){
						if (item.id.substr(0,3)!="jm_"){
							mind_data.data.push({"id":item.id+".link.url","topic":"<a href='../?langid="+langid+"&codeid="+item.id+"' target='newpage'><i class='fa fa-link'></i></a>","parentid":item.id,"background-color":"#fff"});
						}
					}
				});
			}
			open_json(mind_data);
			change_container();
		},
		error: function(XMLHttpRequest, msg, e){
			show_notify("Technical", "Unknow error: " + e, "error");
		}
	});
}

// Save to server
function save_online(){
	//check login status
	if (!check_login_status(true)){
		return;
	}

	var langid = $.urlParam('langid');
	if (!langid || langid==""){
		return;
	}

	//remove url node
	var mind_data = _jm.get_data('node_array');
	mind_data.data.forEach(function (item, index) {
		if (item.id.substr(-9)==".link.url"){
			mind_data.data.splice(index, 1);
		}
	});
	
	//save mind
	var userid = getCookie("userid");
	var mind_id = langid;
	var mind_name = mind_data.data[0].topic;
	var mind_str = jsMind.util.json.json2string(mind_data);
	var mind_author = "";
	var actioin = "add";
	if (_author != "") {
		actioin = "upd";
		mind_author = _author;
	} else {
		mind_author = userid;
	}

	$.ajax({
		url: "../api/mind/",
		type: "POST",
		dataType: "json",
		data: JSON.stringify({
        	action : actioin,
			mindid : mind_id,
			author : mind_author,
			userid : userid,
			mindname : mind_name,
			mindsrc : mind_str
    	}),
		success: function(json){
			if(json.result==0){
				show_notify("Saved", "Saved to server successfully", "success");
			} else {
				show_notify("Technical", json.reason, "error");
			}
		},
		error: function(XMLHttpRequest, msg, e){
			show_notify("Technical", "Unknow error: " + e, "error");
		}
	});
}

window.onresize = function(event) {
	change_container();
};

$(document).ready(function () {
	var langid = $.urlParam('langid');
	if (langid) {
		load_language_mind(langid);
	} else {
		open_json(null);
		change_container();
	}

	if (check_login_status(false)==false){
		$("#li_save_online").hide();
	}
});