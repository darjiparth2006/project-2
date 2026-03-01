<?php
header('Content-Type: application/json');
require_once __DIR__.'/db.php';
$action = $_GET['action'] ?? '';
function json($v){ echo json_encode($v); exit; }
if($action==='list'){
  $stmt = $pdo->query('SELECT id,title,author,isbn FROM books ORDER BY id DESC');
  json($stmt->fetchAll(PDO::FETCH_ASSOC));
}
if($action==='get'){
  $id = intval($_GET['id'] ?? 0);
  $stmt = $pdo->prepare('SELECT id,title,author,isbn FROM books WHERE id=?'); $stmt->execute([$id]);
  json($stmt->fetch(PDO::FETCH_ASSOC));
}
$input = json_decode(file_get_contents('php://input'), true) ?? [];
if($action==='create'){
  $stmt = $pdo->prepare('INSERT INTO books (title,author,isbn) VALUES (?,?,?)');
  $stmt->execute([$input['title'] ?? '', $input['author'] ?? '', $input['isbn'] ?? '']);
  json(['ok'=>true,'id'=>$pdo->lastInsertId()]);
}
if($action==='update'){
  $stmt = $pdo->prepare('UPDATE books SET title=?,author=?,isbn=? WHERE id=?');
  $stmt->execute([$input['title'] ?? '', $input['author'] ?? '', $input['isbn'] ?? '', $input['id']]);
  json(['ok'=>true]);
}
json(['error'=>'invalid action']);
