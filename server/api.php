<?php

$params = array_slice(explode('/', $_SERVER['REQUEST_URI']), 3);
require_once('settings.php');

switch ($params[0]) {
	case 'tasks':
		die(Tasks::handleRequest($params));
		break;
	default:
		die('Invalid parameter: '.$params[0]);
}

function __autoload($className) {
    require_once('classes/'.lcfirst($className).'.php');
}

function normaliseDate($date, $type) {
	$parts = explode('-', $date);
	if (count($parts) === 2) {
		array_push($parts, '01');
		$date = implode('-', $parts);
		if ($type === 'end') {
			return date('Y-m-t', strtotime($date));
		} else {
			return $date;
		}
	}
	return implode('-', $parts);
}

?>