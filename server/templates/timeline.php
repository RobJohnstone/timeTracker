<?php

$periods = 5;

function now($period) {
	$now = new DateTime();
	switch ($period) {
		case 'day':
			return $now;
		case 'week';

			break;
		case 'month':

			break;
	}
}

function periodString($period, $offset) {
	$date = now($period);
	switch ($period) {
		case 'day': 
			$periodIndicator = 'D';
			break;
		case 'week':
			$periodIndicator = 'W';
			break;
		case 'month';
			$periodIndicator = 'M';
			break;
	}

	if ($offset >= 0) {
		$date->add(new DateInterval('P'.$offset.$periodIndicator));
	}
	else {
		$date->sub(new DateInterval('P'.abs($offset).$periodIndicator));
	}
	return $date;
}

?>

<div class="timeline">
	<table class="timelineDays">
		<tr>
			<td class="tilelineBtn timelineLeft">
				&lt;
			</td>
			<?php
			for ($i=0; $i<$periods; $i++) {
				echo '<td class="timelinePeriod" id="timeline_'.$timelinePeriod.'_'.periodString($timelinePeriod, $i - floor($periods/2))->format(DATE_RFC2822).'">'.periodString($timelinePeriod, $i - floor($periods/2))->format('Y-m-d').'</td>';
			}
			?>
			<td class="tilelineBtn timelineRight">
				&gt;
			</td>
		</tr>
	</table>
</div>