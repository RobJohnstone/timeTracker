<?php

$numDays = 5;
$day = new DateTime();
$day->sub(new DateInterval('P'.floor($numDays/2).'D'));
$start = $day->format('Y-m-d');
$day->add(new DateInterval('P'.$numDays.'D'));
$end = $day->format('Y-m-d');

$days = new DaysCollection($start, $end);

?>


<script>
	ATT.data.initialise({'day': JSON.parse('<?php echo $days->toJSON() ?>')});
</script>