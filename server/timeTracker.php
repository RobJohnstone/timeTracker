<?php

$date = new DateTime();
$dateString = $date->format('Y-m-d');

$day = new Day($dateString);

require_once('server/templates/dayView.php');

?>