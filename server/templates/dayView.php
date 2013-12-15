<!doctype html>
<head>
	<link rel="stylesheet" type="text/css" href="client/css/timeTracker.css"/>
	<script type="text/javascript" src="client/js/lib/jquery-2.0.3.min.js"></script>
	<script type="text/javascript" src="client/js/timeTracker.js"></script>
</head>
<body>
	<?php 
		$timelinePeriod = 'day';
	?>
	<div class="timePeriodBar">
		<span class="timePeriod day" id="timePeriod_day">Day</span>
		<span class="timePeriod week" id="timePeriod_week">Week</span>
		<span class="timePeriod month"  id="timePeriod_month">Month</span>
	</div>
	<?php require_once('server/templates/timeline.php'); ?>
	
	<div class="dayContainer detailsContainer">
		<div class="dayContent">
			<p class="date"></p>
			<p>What have you been doing today?</p>
			<textarea class="dayDescription"><?php echo $day->description; ?></textarea>
		</div>
	</div>
	<div class="weekContainer detailsContainer">
		<div class="weekContent">
			<p class="dateContainer">Week starting <span class="date"></span></p>
			<table class="weekTable">
				<tbody>
					<tr>
						<th>Date</th><th>Tasks</th>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
	<div class="monthContainer detailsContainer">
		<div class="monthContent">
			<p class="dateContainer"><span class="date"></span></p>
			<table class="monthTable">
				<tbody>
					<tr>
						<th>Date</th><th>Tasks</th>
					</tr>
				</tbody>
			</table>
		</div>
	</div>

	<?php require_once('server/templates/daysData.php') ?>
</body>