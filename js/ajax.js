$(document).ready(function (){
	hist = new Array();
	getTasksByMainTask(0);
});

function getTimeString(date){
	var time = getDateFromTimestamp(date);
	var month = time.getMonth() + 1
	var day = time.getDate()
	var year = time.getFullYear()
	var hour = time.getHours();
	var min = time.getMinutes();
	if (min < 10) min = "0" + min;
	if (hour < 10) hour = "0" + hour;
	if (day < 10) day = "0" + day;
	if (month < 10) month = "0" + month;
	
	return day + "." + month + "." + year + "<br />" + hour + ":" + min;	
}

function getTasksByMainTask (maintask) {
	if(hist[hist.length - 1] != maintask)
		hist.push(maintask);
		
		
	//toggle the back button
	if(maintask != 0)
		$("#back").show();
	else
		$("#back").hide();
			
	//replace maintask:
	$("#maintask").slideUp("slow", function() { 
		$(this).remove();
	});

	//get new parent task
	
	if(maintask != 0){
		$.ajax({
	    type: "GET",
	    url: "data.php",
	    data: "taskID=" + maintask,
	    success: function(json){
			jsonElem = jQuery.parseJSON(json)[0];
			$("#top").append('<div id="maintask"><div id="name">' + jsonElem.name + 
					'</div><div id="progress"><div class="meter blue"><span style="width:' 
					+ jsonElem.fin_subtask_count / jsonElem.subtask_count * 100 + '%"></span>'
					+ '<div class="textOnBar">' + jsonElem.fin_subtask_count + '/' + 
					jsonElem.subtask_count + '</div></div><div class="meter green" style="margin-top:10px;" >'
					+ '<span style="width: ' + jsonElem.percent + '%"></span><div class="textOnBar">' + jsonElem.percent +'%</div>'
					+ '</div></div></div>');
			}
		});
	}
	else{
		$("#top").append('<div id="maintask"><div id="name">Aktuelle Aufgaben</div></div>');
	}
	
	$(".task").addClass("old_task");
	$(".old_task").slideUp(function() { 
			$(this).remove()
	});
		
	$.ajax({
    type: "GET",
    url: "data.php",
    data: "parentID=" + maintask,
    success: function(json){
		
		tasks = jQuery.parseJSON(json);
		for(var val in tasks){
			
			var curtask = tasks[val];
			var result = "";
			result = result.concat('<div class="task new_task normal" proc="' + curtask["percent"]
			+ '" time="' + getDateFromTimestamp(curtask["deadline"]).getTime() + '" id="' + curtask.id + '" subtasks="' + curtask.subtask_count
			+ '" json="' + val
			+ '" style="display: none;"><table><tr><td class="taskid">' + curtask.id + '</td><td class="taskname">'
			+ curtask.name + '</td><td class="taskcat">' + curtask.category + '</td><td class="taskprogress">');
			
			margin = "";
			//only display if there are subtasks
			if(curtask.subtask_count > 0){
				result = result.concat('<div class="meter blue"><span style="width: '
				+ curtask.fin_subtask_count / curtask.subtask_count * 100 +'%"></span><div class="textOnBar">'
				+ curtask.fin_subtask_count + '/' + curtask.subtask_count + '</div></div>');
				$margin = 'style="margin-top:10px;"';
			}
			result = result.concat('<div class="meter green" ' + margin + ' ><span style="width: '
			+ curtask.percent + '%"></span><div class="textOnBar">' + curtask.percent + '%</div></div></td>');
		
			result = result.concat('<td class="countdown"></td>');
			
			
			result = result.concat('<td class="taskdeadline">' + getTimeString(curtask.deadline) + '</td></tr></table></div>');
			
			$("#content").append(result);
			
		}
		registerClickListeners();
		
		$(".new_task").slideDown(function(){
			$(this).removeClass("new_task");
		});
       
       }
	});	 
}

function registerClickListeners(){
	$('.task').each(function(index){
				if ($(this).attr("proc") == "100"){
					$(this).addClass("finished");
				}
								
				time = new Date(parseInt($(this).attr("time")));
				cd = $(this).children().children().children().children(".countdown");
				now = new Date();
				if(time < now){
					$(this).addClass("overdue");
					$(this).removeClass("normal");
					cd.countdown('destroy');
					cd.countdown({since: time, format: 'YOWDHM', significant: 2});
				}
				else
					cd.countdown({until: time, format: 'YOWDHM', significant: 2, onExpiry: registerClickListeners});		
			});
	
	$(".task").click(function(){
		if($(this).attr("subtasks") > 0)
			getTasksByMainTask($(this).attr("id"));
	});
}

function getDateFromTimestamp(stamp){
	var a=stamp.split(" ");
	var d=a[0].split("-");
	var t=a[1].split(":");
	return new Date(d[0],(d[1]-1),d[2],t[0],t[1],t[2]);
}
