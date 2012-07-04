<?php
	$mysqlUser = "todo";
	$mysqlPass = "LSwEGRa47T6xL5T5";
	$database = "todo";
	
	$link = mysql_connect('localhost', $mysqlUser, $mysqlPass);
	
	@mysql_select_db($database, $link) or die( "Unable to select database");

	$showCountdown = 1;
	if(isset($_GET["countdown"]))
		$showCountdown = $_GET["countdown"];
		
	$where = "";
	if(isset($_GET["finished"]))
		if($_GET["finished"])
			$where = "AND IFNULL(status.perc, 0) = 100 AND IFNULL(subtask_count, 0) = IFNULL(fin_subtask_count, 0)";
		else
			$where = "AND (IFNULL(status.perc, 0) < 100 OR IFNULL(subtask_count, 0) > IFNULL(fin_subtask_count, 0))";
	
	$parent = "";
	if(isset($_GET["parentID"])){
		$parent = "WHERE IFNULL(parentTask, 0) = ".$_GET["parentID"];
	}
	
	if(isset($_GET["taskID"])){
		$where = "WHERE tasks.id = " . $_GET["taskID"];
	}
	
	
	$query = "
	SELECT tasks.name, tasks.id, tasks.deadline,  IFNULL(status.perc, 0) AS percent, IFNULL(subtask_count, 0) AS subtask_count, IFNULL(fin_subtask_count, 0) AS fin_subtask_count, task_category.name AS category, IFNULL(parentTask, 0) AS parentTask
        FROM tasks
        
        LEFT JOIN (SELECT *, MAX(time) AS latest_time FROM task_status GROUP BY task_id) AS status 
        ON status.task_id = tasks.id
        
        LEFT JOIN (SELECT task_id,  COUNT(*) AS subtask_count FROM taskissubtask GROUP BY task_id) AS subtasks
        ON subtasks.task_id = tasks.id
        
        LEFT JOIN (
        SELECT todo.tasks.id, COUNT( * ) AS fin_subtask_count
        FROM todo.task_status
        INNER JOIN todo.taskissubtask ON todo.taskissubtask.subtask_id = todo.task_status.task_id
        INNER JOIN todo.tasks ON todo.tasks.id = todo.taskissubtask.task_id
        WHERE todo.task_status.perc =100
        GROUP BY todo.tasks.id
        ) AS finished_subtasks
        ON finished_subtasks.id = tasks.id
        
        INNER JOIN task_category ON tasks.category_id = task_category.id
        
       	LEFT JOIN (SELECT subtask_id, task_id  AS parentTask FROM taskissubtask) AS isSubtaskOf ON isSubtaskOf.subtask_id = tasks.id 
		".$parent." ".$where."

        ORDER BY tasks.deadline
	";
	
	//echo $query."<br />";
		
	//WHERE IFNULL(status.perc, 0) < 100\n
	
	$result = mysql_query($query, $link);
	$num = mysql_numrows($result);
	
	mysql_close();
	
	$rows = array();
	while($r = mysql_fetch_assoc($result)) {
	    $rows[] = $r;
	}
	echo json_encode($rows);
	
	?>