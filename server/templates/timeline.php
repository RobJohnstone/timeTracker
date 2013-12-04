<?php

$days = 5;

function today($offset) {
	$date = new DateTime();
	if ($offset >= 0) {
		$date->add(new DateInterval('P'.$offset.'D'));
	}
	else {
		$date->sub(new DateInterval('P'.abs($offset).'D'));
	}
	return $date;
}

?>

<div class="timeline">
	<table class="timelineDays">
		<tr>
			<td class="tilelineBtn timelineLeft">
				Left
			</td>
			<?php
			for ($i=0; $i<$days; $i++) {
				echo '<td class="day" id="timeline_day_'.today($i - floor($days/2))->format(DATE_RFC2822).'">'.today($i - floor($days/2))->format('Y-m-d').'</td>';
			}
			?>
			<td class="tilelineBtn timelineRight">
				Right
			</td>
		</tr>
	</table>
</div>