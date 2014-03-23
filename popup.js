/**
*
*	Ogle Bot (extension)
*		
*	Author: Luke Taylor
*	Description: Allows you to track a user from the Appcelerator Q & A Leaderboard.
*	Version: 1.0
*
**/

// Saves options to localStorage.
function save_settings () {
	var name = $("#txtName").val();
	var tracking = $('input[name="optRadios"]:checked').val();
	
	localStorage["name"] = name || ""; // name of user to track
	localStorage["tracking"] = tracking || 0; // check for tracking mode (single||multiple)
	
	update_leaderboard();
}

// Restores any values from localStorage.
function restore_settings () {
	var savedName = localStorage["name"];
	if (!savedName) {
		savedName = '';
	}
	$("#txtName").val(savedName);
	
	var savedTracking = localStorage["tracking"];
	if (!savedTracking) {
		savedTracking = 0;
	}
	if (savedTracking > 0) {
		$("#single").prop("checked", true);
	} else {
		$("#multiple").prop("checked", true);
	}
}

// calculate % for progress bars
function percent (s) {
	var ts = localStorage["topscore"];
	var t = ts.replace(',', '');
		t = parseInt(t) + 2500;
	var n = s.replace(',', '');
	var a = (n / t) * 100;
	if (a > 100) {a = 100;}
	return a;
}

function update_leaderboard () {
	// retrieve data from localstorage for surrounding users
	var content = localStorage["content"];
	$('.main .panel-body').html(content);
	
	$('.help-txt').hide();
	$("#row1").show();
	$("#row2").show();
	$("#row3").show();
	$("#row4").show();
	$("#row5").show();
		
	var storedTracking = localStorage["tracking"] || 0;
	if (storedTracking > 0) {
		$("#row1").hide();
		$("#row2").hide();
		$("#row4").hide();
		$("#row5").hide();
	} else {
		$("#row1").show();
		$("#row2").show();
		$("#row4").show();
		$("#row5").show();
	}
	
	for (var i = 0; i < 5; i++) {
		var id = i + 1;
		var user = localStorage["user" + id] || {};
		if (!$.isEmptyObject(user)) {
			var parsed = JSON.parse(user) || {};
			if (!$.isEmptyObject(parsed)) {
				$('#user' + id).html("<a class='devlink' href='" + parsed.devlink + "'>" + parsed.name + "</a>");
				$('#user-rank-' + id).text(parsed.rank);
				$('#user-score-' + id).text(parsed.points);
				$('#user-score-' + id).parent().width(percent(parsed.points) + '%');
			}
		} else {
			$("#row" + id).hide();
		}
	}
}

// Initialise JS on popup
document.addEventListener('DOMContentLoaded', function () {
	restore_settings();	
	var name = localStorage["name"];
	if (name) {
		update_leaderboard();
	} else {
		$('.help-txt').html('<p>This is your first time, please use the options to set who you wish to track.</p>');
	}
			
	// Adds interaction for bootstrap tabs
	$('#myTabs a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	});
	
	// Opens URL's for buttons
	$('.btn').click(function () {
		if ($(this).attr('href')) {
			var newUrl = $(this).attr('href');
			chrome.tabs.create({url: newUrl});
		}
	});
	
	// Opens URL's for devlinks
	$('.devlink').click(function () {
		if ($(this).attr('href')) {
			var newUrl = $(this).attr('href');
			chrome.tabs.create({url: newUrl});
		}
	});

	// Submit form information
	$('#submit').click(function (e) {
		e.preventDefault();
		var txt = $('#submit span');
		txt.fadeOut(200, function () {
			txt.html('Saved');
			save_settings();
			txt.fadeIn(200, function () {
				setTimeout(function() {
					txt.html('Submit');
				}, 800);
				// $('#myTabs a[href="#leaderboard"]').tab('show');
			});
		});
	});
	
	$('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
		update_leaderboard();
	});
});