<?php

require_once('../session.php');
start_session_and_headers();

$input = json_decode(file_get_contents('php://input'), true);
$username = $input['userName'] ?? '';
$account = $input['account'] ?? '';
$password = $input['password'] ?? '';

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);  // Hashed password for storing
$accountsData = file_get_contents('../data/accounts.txt');
$lines = explode("\n", $accountsData);
$accountExists = false;

foreach ($lines as $line) {
    $parts = explode(";", $line);

    // Check we have at least the account, password, and username in the line.
    if (count($parts) >= 3) {
        $existingAccount = $parts[0];
        $existingPassword = $parts[1];

        // Check for matching account.
        if ($existingAccount === $account) {
            // Verify if the passwords match.
            if (password_verify($password, $existingPassword)) {
                $accountExists = true;
                break;
            }
        }
    }
}

if ($accountExists) {
    echo json_encode(['status' => 'error', 'message' => 'Account and password combination already exists.']);
    exit();
}

// Create the directory structure and account.txt entry if account doesn't exist
$hashedDirectory = hash('sha256', $username . "-" . $account);
$directoryPath = "../data/users/{$hashedDirectory}";

if (!is_dir($directoryPath)) {
    mkdir($directoryPath, 0777, true);
    file_put_contents("{$directoryPath}/overall.txt", "");
    mkdir("{$directoryPath}/" . date('Y'), 0777, true);
}

// Store the new account in the account.txt file
$newAccountData = "{$account};{$hashedPassword};{$username}\n";
file_put_contents('../data/accounts.txt', $newAccountData, FILE_APPEND);

$_SESSION['username'] = $username;
$_SESSION['userfolder'] = $directoryPath;

echo json_encode(['status' => 'success', 'message' => 'Registration successful!']);
