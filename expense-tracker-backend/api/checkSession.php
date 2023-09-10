<?php

require_once('../session.php');
start_session_and_headers();

$response = [
    'authenticated' => false,
    'username' => ''
];

if (isset($_SESSION['username'])) {
    $response['authenticated'] = true;
    $response['username'] = $_SESSION['username']; // or whatever session variable you use to store user data
}

echo json_encode($response);
