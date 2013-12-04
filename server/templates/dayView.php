<!doctype html>
<head>
	<link rel="stylesheet" type="text/css" href="client/css/timeTracker.css"/>
	<script type="text/javascript" src="client/js/lib/jquery-2.0.3.min.js"></script>
	<script type="text/javascript" src="client/js/timeTracker.js"></script>
</head>
<body>
	<?php require_once('server/templates/timeline.php'); ?>
	
	<div class="dayContainer">
		<p class="date"></p>
		<p>What have you been doing today?</p>
		<p><textarea class="dayDescription"><?php echo $day->description; ?></textarea></p>
	</div>

	<?php require_once('server/templates/daysData.php') ?>
</body>