<?php

$date = $_GET['day'];

$day = new Day($date);

echo $day->toJSON();

?>