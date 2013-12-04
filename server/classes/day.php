<?php

class Day {

	private $dataStore;

	private $data = array();

	private $date;

	private $initialised = false;

	private $recordExists = false;

	public function __construct($date) {
		$this->date = $date;
	}

	private function initialise() {
		$this->dataStore = $dataStore = DataStore::getInstance();
		$stmt = $dataStore->prepare('SELECT * FROM days WHERE date=:date');
		$dataStore->execute($stmt, array('date'=>$this->date));
		if ($stmt->rowCount() === 0) {
			$this->data['date'] = $this->date;
		}
		else {
			$this->data = $stmt->fetch(PDO::FETCH_ASSOC);
			$this->recordExists = true;
		}
		$this->initialised = true;
	}

	private function createRecord($date) {
		$dataStore = $this->dataStore;
		$stmt = $dataStore->prepare('INSERT INTO days (date) values (:date)');
		$dataStore->execute($stmt, array('date'=>$date));
		return array('date'=>$date);
	}

	public function getRecord() {
		if (!$this->initialised) $this->initialise();
		return $this->data;
	}

	public function saveDescription($description) {
		if (!$this->initialised) $this->initialise();
		$dataStore = $this->dataStore;
		if ($this->recordExists) {
			$stmt = $dataStore->prepare('UPDATE days SET description=:description WHERE date=:date');
			$dataStore->execute($stmt, array('description'=>$description, 'date'=>$this->data['date']));
		}
		else {
			$stmt = $dataStore->prepare('INSERT INTO days (date, description) values (:date, :description)');
			$dataStore->execute($stmt, array('date'=>$this->data['date'], 'description'=>$description));
		}
		$this->data['description'] = $description;
	}

	public function toJSON() {
		if (!$this->initialised) $this->initialise();
		return json_encode($this->data);
	}

	public function __get($property) {
		if (!$this->initialised) $this->initialise();
		if (isset($this->data[$property])) {
			return $this->data[$property];
		}
		else {
			return '';
		}
	}
}

?>