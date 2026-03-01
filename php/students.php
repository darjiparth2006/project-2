<?php
header('Content-Type: application/json');
require_once __DIR__.'/db.php';

$action = $_GET['action'] ?? '';

function json($v){ echo json_encode($v); exit; }

if($action==='list'){
  $stmt = $pdo->query('SELECT id,name,email FROM students ORDER BY id DESC');
  $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
  foreach($students as &$s){
    $s['books'] = [];
    $q = $pdo->prepare('SELECT b.id,b.title FROM allocations a JOIN books b ON a.book_id=b.id WHERE a.student_id=?');
    $q->execute([$s['id']]);
    $s['books'] = $q->fetchAll(PDO::FETCH_ASSOC);
  }
  json($students);
}

if($action==='get'){
  $id = intval($_GET['id'] ?? 0);
  $stmt = $pdo->prepare('SELECT id,name,email FROM students WHERE id=?'); $stmt->execute([$id]);
  $s = $stmt->fetch(PDO::FETCH_ASSOC);
  if(!$s) json([]);
  $q = $pdo->prepare('SELECT b.id,b.title FROM allocations a JOIN books b ON a.book_id=b.id WHERE a.student_id=?');
  $q->execute([$id]); $s['books']=$q->fetchAll(PDO::FETCH_ASSOC);
  json($s);
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];

if($action==='create'){
  $stmt = $pdo->prepare('INSERT INTO students (name,email) VALUES (?,?)');
  $stmt->execute([$input['name'] ?? '', $input['email'] ?? '']);
  json(['ok'=>true,'id'=>$pdo->lastInsertId()]);
}

if($action==='update'){
  $stmt = $pdo->prepare('UPDATE students SET name=?,email=? WHERE id=?');
  $stmt->execute([$input['name'] ?? '', $input['email'] ?? '', $input['id']]);
  json(['ok'=>true]);
}

json(['error'=>'invalid action']);
