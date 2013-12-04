<?php

$date = $_POST['date'];
$description = $_POST['description'];

$day = new Day($date);

$day->saveDescription($description);

?>