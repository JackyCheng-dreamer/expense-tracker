<?php
// Always start your session at the beginning of the script.
require_once('../session.php');
start_session_and_headers();

$account_data = file_get_contents('../data/accounts.txt');

$accounts = [];
$lines = explode("\n", $account_data);
foreach ($lines as $line) {
    $parts = explode(';', $line);
    if (count($parts) !== 3) {
        continue;  // Skip this iteration and move to the next line
    }

    list($ac, $pw, $userName) = $parts;
    $accounts[$ac] = ['pw' => $pw, 'userName' => $userName];
}

$input = json_decode(file_get_contents('php://input'), true);
$account = $input['account'] ?? '';
$password = $input['password'] ?? '';

if (isset($accounts[$account]) && password_verify($password, $accounts[$account]['pw'])) {
    $_SESSION['username'] = $accounts[$account]['userName']; // Store username in the session

    // Compute user directory based on the username and account and store in session
    $hashedDirectory = hash('sha256', $accounts[$account]['userName'] . "-" . $account);
    $_SESSION['userfolder'] = "../data/users/{$hashedDirectory}";

    echo json_encode(['success' => true, 'userName' => $accounts[$account]['userName']]);
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid account or password.']);
}
