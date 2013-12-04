<?php

$start = $_GET['daysStart'];
$end = $_GET['daysEnd'];

$days = new DaysCollection($start, $end);

echo $days->toJSON();

?>