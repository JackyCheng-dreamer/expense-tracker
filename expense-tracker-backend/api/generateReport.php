<?php

require_once('../session.php');
start_session_and_headers();

echo json_encode(['success' => true, 'msg' => "hihihi"]);

/* 
System.out.println("{
    'success':true,
    'msg':'hihihi'
}") 
*/