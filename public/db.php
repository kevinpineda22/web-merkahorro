<?php
// Conexión a la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "postulaciones";

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Obtener los datos del formulario
$fecha_postulacion = $_POST['fecha-postulacion'];
$nombre_apellido = $_POST['nombre-apellido'];
$nivel_educativo = $_POST['nivel-educativo'];
$cargo = $_POST['cargo'];
$telefono = $_POST['telefono'];
$genero = $_POST['genero'];
$pais_domicilio = $_POST['pais-domicilio'];
$ciudad_domicilio = $_POST['ciudad-domicilio'];
$zona_residencia = $_POST['zona-residencia'];
$barrio = $_POST['barrio'];
$fecha_nacimiento = $_POST['fecha-nacimiento'];
$tipo_documento = $_POST['tipo-documento'];
$recomendado = $_POST['recomendado'];

// Manejo del archivo adjunto
$hoja_vida_blob = null;
if (isset($_FILES['hoja-vida']) && $_FILES['hoja-vida']['error'] == UPLOAD_ERR_OK) {
    $hoja_vida = $_FILES['hoja-vida']['tmp_name'];
    $hoja_vida_blob = addslashes(file_get_contents($hoja_vida));
} else {
    $hoja_vida_blob = null; // Si el archivo no se sube, el campo puede ser null
}

// Preparar y ejecutar la consulta
$stmt = $conn->prepare("INSERT INTO postulaciones (fecha_postulacion, nombre_apellido, nivel_educativo, cargo, telefono, genero, 
        pais_domicilio, ciudad_domicilio, zona_residencia, barrio, fecha_nacimiento, tipo_documento, recomendado, hoja_vida)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

if (!$stmt) {
    die("Error en la preparación de la consulta: " . $conn->error);
}

$stmt->bind_param('ssssssssssssss', $fecha_postulacion, $nombre_apellido, $nivel_educativo, $cargo, $telefono, $genero, 
        $pais_domicilio, $ciudad_domicilio, $zona_residencia, $barrio, $fecha_nacimiento, $tipo_documento, $recomendado, $hoja_vida_blob);

if ($stmt->execute()) {
    echo "Postulación guardada exitosamente.";
} else {
    echo "Error al ejecutar la consulta: " . $stmt->error;
}

// Cerrar la conexión
$stmt->close();
$conn->close();

echo "Formulario enviado con éxito.";
?>

