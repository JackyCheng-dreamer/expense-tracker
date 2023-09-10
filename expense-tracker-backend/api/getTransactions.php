<?php

require_once('../session.php');
start_session_and_headers();

$response = [
    'status' => 'error',
    'message' => '',
    'transactions' => []
];

if (!isset($_SESSION['userfolder'])) {
    $response['message'] = "User not authenticated.";
    echo json_encode($response);
    exit();
}


$yearDirectory = $_SESSION['userfolder'] . "/" . date('Y');
$filePath = $yearDirectory . "/" . date('m') . "-expenses.txt";
if (!file_exists($yearDirectory) || !file_exists($filePath)) {
    $response['message'] = "No transactions found for this month.";
    echo json_encode($response);
    exit();
}

$transactionsData = file_get_contents($filePath);
$transactions = json_decode($transactionsData, true); // Decode as array

if (json_last_error() !== JSON_ERROR_NONE) {
    $response['message'] = "Error reading transaction data.";
    echo json_encode($response);
    exit();
}

$response['status'] = 'success';
$response['transactions'] = $transactions;
echo json_encode($response);
