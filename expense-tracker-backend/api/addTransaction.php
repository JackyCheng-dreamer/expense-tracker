<?php

require_once('../session.php');
start_session_and_headers();

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->text) || !isset($data->amount) || !isset($data->category)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid input.']);
    exit();
}

// Check if user is authenticated
if (!isset($_SESSION['userfolder'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not authenticated.']);
    exit();
}

$userDirectory = $_SESSION['userfolder']; // Get user directory from the session

// Check if user exists
if (!is_dir($userDirectory)) {
    echo json_encode(['status' => 'error', 'message' => 'User does not exist.']);
    exit();
}

// Check if year folder exists, if not, create it
$yearDirectory = $userDirectory . "/" . date('Y');
if (!is_dir($yearDirectory)) {
    mkdir($yearDirectory, 0777, true);
}

// Check if month-expense.txt file exists, if not, create it
$monthFile = $yearDirectory . "/" . date('m') . "-expenses.txt";
$fileContents = [];
if (file_exists($monthFile)) {
    $contents = file_get_contents($monthFile);
    if (!empty($contents)) {
        $fileContents = json_decode($contents, true);
    }
}

// Add transaction to file contents and save back
$transactionArray = [
    'text' => $data->text,
    'amount' => $data->amount,
    'category' => $data->category
];


$fileContents[] = $transactionArray;
file_put_contents($monthFile, json_encode($fileContents));

echo json_encode(['status' => 'success']);
