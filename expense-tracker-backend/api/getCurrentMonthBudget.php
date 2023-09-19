<?php

require_once('../session.php');
start_session_and_headers();

// Check if user is authenticated
if (!isset($_SESSION['userfolder'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not authenticated.']);
    exit();
}

$userDirectory = $_SESSION['userfolder'];

// Check if user exists
if (!is_dir($userDirectory)) {
    echo json_encode(['status' => 'error', 'message' => 'User does not exist.']);
    exit();
}

// Define the path for the current month's budget file
$yearDirectory = $userDirectory . "/" . date('Y');
$monthFile = $yearDirectory . "/" . date('m') . "-budget.txt";

if (!file_exists($monthFile)) {
    echo json_encode(['status' => 'error', 'message' => 'No budget found for the current month.']);
    exit();
}

$budget = file_get_contents($monthFile);
echo json_encode(['status' => 'success', 'budget' => $budget]);
