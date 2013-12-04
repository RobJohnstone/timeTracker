<?php

$specificDays = json_decode($_GET['specificDays']);

$days = array();

foreach ($specificDays as $key => $date) {
	$day = new Day($date);
	$days[$date] = $day->getRecord();
}

die(json_encode($days));
?>