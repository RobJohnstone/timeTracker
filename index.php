<?php

require_once('server/settings.php');

if (count($_POST)) {
	switch ($_POST['save']) {
		case 'day': 
			require('server/saveDay.php');
			break;
		default:
			die('Invalid save type');
	}
	
}
elseif (isset($_GET['day'])) {
	require('server/getDay.php');
}
elseif (isset($_GET['daysStart']) && isset($_GET['daysEnd'])) {
	require('server/getDays.php');
}
elseif (isset($_GET['specificDays'])) {
	require('server/getSpecificDays.php');
}
else {
	require('server/timeTracker.php');
}

function __autoload($className) {
    require_once('server/classes/'.lcfirst($className).'.php');
}

?>