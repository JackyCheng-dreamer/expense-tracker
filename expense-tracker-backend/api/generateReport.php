<?php

require_once('../session.php');
start_session_and_headers();

// Check if user is authenticated
if (!isset($_SESSION['userfolder']) || !isset($_SESSION['username'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not authenticated.']);
    exit();
}

require('../vendor/autoload.php');
$userName = $_SESSION['username'];
$userDirectory = $_SESSION['userfolder'];

// Check if user exists
if (!is_dir($userDirectory)) {
    echo json_encode(['status' => 'error', 'message' => 'User does not exist.']);
    exit();
}

// Check if year folder exists, if not, create it
$yearDirectory = $userDirectory . "/" . date('Y');
if (!is_dir($yearDirectory)) {
    echo json_encode(['status' => 'error', 'message' => 'User have no data.']);
    exit();
}

// Check if month-expense.txt file exists, if not, create it
$month = date('m');
$monthExpenseFile = $yearDirectory . "/" . $month . "-expenses.txt";
$monthBudgetFile = $yearDirectory . "/" . $month . "-budget.txt";
$fileContents = [];
if (!file_exists($monthExpenseFile) && !file_exists($monthBudgetFile)) {
    echo json_encode(['status' => 'error', 'message' => 'User have no transactions/budget.']);
    exit();
}
$expenses_data = json_decode(file_get_contents($monthExpenseFile), true);
$budget = file_get_contents($monthBudgetFile);
$incomes = [];
$expenses = [];

foreach ($expenses_data as $expense) {
    if ($expense['amount'] > 0)
        $incomes[] = $expense;
    else
        $expenses[] = $expense;
}

$pdf = new FPDF();
$pdf->AddPage();
$pdf->SetFont('Arial', 'B', 20);
$pdf->Cell(40, 10, "Expense Report for month: $month");
$pdf->SetFont('Arial', 'B', 10);
$pdf->Ln();
# preparing our pdf data
$pdf->Cell(40, 10, "Username: $userName");
$pdf->Ln();
$pdf->Cell(40, 10, "Budget: $budget");
$pdf->Ln();
$pdf->Cell(40, 10, "Income records:");
$pdf->Ln();
$totalIncome = 0;
foreach ($incomes as $record) {
    $totalIncome += $record['amount'];
    $formattedExpenses = "Category: " . $record['category'] . " ; Name: " .  $record['text'] . " ; Amount: " .  $record['amount'];
    $pdf->Cell(60, 10, $formattedExpenses);
    $pdf->Ln();
}
$pdf->Cell(60, 10, "The Total Income for this month is $totalIncome");
$pdf->Ln();

$totalExpense = 0;
$pdf->Cell(40, 10, "Expense records:");
$pdf->Ln();
foreach ($expenses as $record) {
    $totalExpense += $record['amount'];
    $formattedExpenses = "Category: " . $record['category'] . " ; Name: " .  $record['text'] . " ; Amount: " .  $record['amount'];
    $pdf->Cell(60, 10, $formattedExpenses);
    $pdf->Ln();
}
$pdf->Cell(60, 10, "The Total Expense for this month is $totalExpense");
$pdf->Ln();

// calculate teh bduget deficit
$totalBudget = floatval($budget);
$remaining = $totalBudget + $totalExpense;

if ($remaining >= 0)
    $pdf->Cell(40, 10, "User is within the budget with a balance of $$remaining .");
else
    $pdf->Cell(40, 10, "User is in deficit by $" . abs($remaining) . ".");
$pdf->Ln();
$filename = "$userName-$month-ExpenseTrackerReport.pdf";
header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="' . $filename . '"');

$pdf->Output('D', $filename);
