<?php

class Tasks {

	public static function getTasks($start, $end) {
		$datastore = DataStore::getInstance();
		$stmt = $datastore->prepare('SELECT * FROM tasks WHERE date BETWEEN :start AND :end');
		$datastore->execute($stmt, array('start'=>$start, 'end'=>$end));
		$result = array();
		while ($data = $stmt->fetch(PDO::FETCH_ASSOC)) {
			if (!isset($result[$data['date']])) $result[$data['date']] = array();
			array_push($result[$data['date']], $data);
		}
		return $result;
	}

	public static function handleRequest($params) {
		$datastore = DataStore::getInstance();
		switch ($_SERVER['REQUEST_METHOD']) {
			case 'POST':
				$postData = json_decode(file_get_contents("php://input"));
				if (isset($postData->id)) {
					$stmt = $datastore->prepare('UPDATE tasks SET task=:taskText WHERE id=:id');
					$datastore->execute($stmt, array('taskText'=>$postData->task, 'id'=>$postData->id));
				} else {
					$stmt = $datastore->prepare('INSERT INTO tasks (date, task) VALUES (:date, :taskText)');
					$datastore->execute($stmt, array('date'=>$postData->date, 'taskText'=>$postData->task));
				}
				die();
				break;
			case 'GET':
				$start = normaliseDate($params[1], 'start');
				$end = (count($params) > 2) ? normaliseDate($params[2], 'end') : normaliseDate($params[1], 'end');
				die(json_encode(Tasks::getTasks($start, $end)));
			default:
				die('could not detect request method');
		}
	}
}

?>