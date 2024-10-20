<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Ruta del archivo JSON
$file = "data.json";

// Si no existe el archivo JSON, se crea uno vacío
if (!file_exists($file)) {
    file_put_contents($file, json_encode([
        "images" => [],
        "likes" => [],
        "comments" => []
    ]));
}

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET") {
    // Leer los datos del archivo JSON
    $data = json_decode(file_get_contents($file), true);
    echo json_encode($data);
} elseif ($method === "POST") {
    // Guardar los datos enviados al archivo JSON
    $input = json_decode(file_get_contents("php://input"), true);
    file_put_contents($file, json_encode($input));
    echo json_encode(["message" => "Datos guardados correctamente"]);
} else {
    echo json_encode(["message" => "Método no permitido"]);
}
