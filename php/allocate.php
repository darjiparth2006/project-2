<?php
header('Content-Type: application/json');
require_once __DIR__.'/db.php';
$action = $_GET['action'] ?? '';
function json($v){ echo json_encode($v); exit; }

if($action==='list'){
  $stmt = $pdo->query('SELECT a.id,a.when_allocated,s.name as student_name,b.title as book_title FROM allocations a JOIN students s ON a.student_id=s.id JOIN books b ON a.book_id=b.id ORDER BY a.when_allocated DESC');
  json($stmt->fetchAll(PDO::FETCH_ASSOC));
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];
if($action==='allocate'){
  $stmt = $pdo->prepare('INSERT INTO allocations (student_id,book_id,when_allocated) VALUES (?,?,NOW())');
  $stmt->execute([$input['student_id'],$input['book_id']]);
  json(['ok'=>true,'id'=>$pdo->lastInsertId()]);
}

json(['error'=>'invalid action']);
