<?php

class DaysCollection {

	private $days = array();

	public function __construct($start, $end) {
		$startDate = new DateTime($start);
		$endDate = new DateTime($end);
		$dayInterval = new DateInterval('P1D');

		for ($day=$startDate; $day<$endDate; $day->add($dayInterval)) {
			$dayObj = new Day($day->format('Y-m-d'));
			$record = $dayObj->getRecord();
			$this->days[$record['date']] = $record;
		}
	}

	public function toJSON() {
		return json_encode($this->days);
	}

}

?>