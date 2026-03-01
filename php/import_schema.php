<?php
// Simple importer to run sql/schema.sql using mysqli multi_query
$host = '127.0.0.1';
$user = 'root';
$pass = '';
$path = __DIR__ . '/../sql/schema.sql';
if(!file_exists($path)){
  echo "schema file not found: $path\n";
  exit(1);
}
$sql = file_get_contents($path);
$mysqli = new mysqli($host, $user, $pass);
if($mysqli->connect_errno){
  echo "Connect failed: " . $mysqli->connect_error . "\n";
  exit(1);
}

if($mysqli->multi_query($sql)){
  do { /* flush results */
    if ($res = $mysqli->store_result()) { $res->free(); }
  } while ($mysqli->more_results() && $mysqli->next_result());
  echo "Imported schema successfully.\n";
} else {
  echo "Import failed: " . $mysqli->error . "\n";
  exit(1);
}

$mysqli->close();
