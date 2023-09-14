<?php

function start_session_and_headers()
{
    // Start the session
    session_start();

    // Set headers
    header('Access-Control-Allow-Origin: http://localhost:3000'); // The origin of our React app.
    header('Content-Type: application/json');
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Credentials: true");
}
