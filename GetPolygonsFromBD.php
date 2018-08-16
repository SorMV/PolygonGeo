<?php

require 'Initialize.php';

$results = Database::getResults('
	SELECT 	Mas
	   FROM cassa.$objects
');


header('Content-Type: application/json');

foreach($results as $k => $v) {
	foreach($v as $key => $value) {
		if(!(is_null($value))) {
			//echo $value;
			$val=$value;
		}
	}

}
echo("{ \"type\": \"Polygon\", \"coordinates\": [[$val]]}");

//exit;

?>







