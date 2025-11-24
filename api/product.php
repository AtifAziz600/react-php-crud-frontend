<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header('Content-Type: application/json');

$db_conn = mysqli_connect("localhost", "root", "", "crud");
if ($db_conn === false) {
    die(json_encode(["error" => "Could Not Connect: " . mysqli_connect_error()]));
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case "GET":
        $path = explode('/', $_SERVER['REQUEST_URI']);

        if (isset($path[4]) && is_numeric($path[4])) {
            // Single product
            $pid = $path[4];

            $stmt = mysqli_prepare($db_conn, "SELECT * FROM tbl_product WHERE p_id = ?");
            mysqli_stmt_bind_param($stmt, "i", $pid);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);

            if ($row = mysqli_fetch_assoc($result)) {
                $json = [
                    "id" => $row["p_id"],
                    "ptitle" => $row["ptitle"],
                    "pprice" => $row["pprice"],
                    "pimage" => $row["pfile"],
                    "status" => $row["pstatus"]
                ];
                echo json_encode($json);
            } else {
                echo json_encode(["error" => "Product not found"]);
            }
            mysqli_stmt_close($stmt);
        } else {
            // All products
            $query = mysqli_query($db_conn, "SELECT * FROM tbl_product");
            if (mysqli_num_rows($query) > 0) {
                $json_array = [];
                while ($row = mysqli_fetch_array($query)) {
                    $json_array[] = [
                        "id" => $row['p_id'],
                        "ptitle" => $row["ptitle"],
                        "pprice" => $row["pprice"],
                        "pimage" => $row["pfile"],
                        "status" => $row["pstatus"]
                    ];
                }
                echo json_encode($json_array);
            } else {
                echo json_encode(["result" => "No products found"]);
            }
        }
        break;

    case "POST":
        if (isset($_FILES['pfile']) && isset($_POST['ptitle']) && isset($_POST['pprice'])) {
            $ptitle = $_POST['ptitle'];
            $pprice = $_POST['pprice'];
            $filename = time() . "_" . $_FILES['pfile']['name'];
            $temp = $_FILES['pfile']['tmp_name'];

            $destination = $_SERVER['DOCUMENT_ROOT'] . "/crud/images/" . $filename;

            $stmt = mysqli_prepare($db_conn, "INSERT INTO tbl_product (ptitle, pprice, pfile, pstatus) VALUES (?, ?, ?, 1)");
            mysqli_stmt_bind_param($stmt, "sss", $ptitle, $pprice, $filename);

            if (mysqli_stmt_execute($stmt)) {
                move_uploaded_file($temp, $destination);
                echo json_encode(["success" => "Product Added Successfully", "id" => mysqli_insert_id($db_conn)]);
            } else {
                echo json_encode(["error" => "Failed to add product"]);
            }
            mysqli_stmt_close($stmt);
        } else {
            echo json_encode(["error" => "Invalid data or file not provided"]);
        }
        break;

    case "PUT":
        $contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';

        if (strpos($contentType, 'multipart/form-data') !== false) {
            // Handle multipart form data (for image update)
            if (isset($_POST['id'], $_POST['ptitle'], $_POST['pprice'], $_POST['status'])) {
                $pid = $_POST['id'];
                $ptitle = $_POST['ptitle'];
                $pprice = $_POST['pprice'];
                $status = $_POST['status'];

                $updateFields = "ptitle = ?, pprice = ?, pstatus = ?";
                $types = "ssi";
                $params = [$ptitle, $pprice, $status];

                if (isset($_FILES['pfile']) && $_FILES['pfile']['error'] === UPLOAD_ERR_OK) {
                    $filename = time() . "_" . $_FILES['pfile']['name'];
                    $temp = $_FILES['pfile']['tmp_name'];
                    $destination = $_SERVER['DOCUMENT_ROOT'] . "/crud/images/" . $filename;

                    $updateFields .= ", pfile = ?";
                    $types .= "s";
                    $params[] = $filename;

                    if (!move_uploaded_file($temp, $destination)) {
                        echo json_encode(["error" => "Failed to upload image"]);
                        exit;
                    }
                }

                $params[] = $pid;
                $types .= "i";

                $stmt = mysqli_prepare($db_conn, "UPDATE tbl_product SET $updateFields WHERE p_id = ?");
                mysqli_stmt_bind_param($stmt, $types, ...$params);

                if (mysqli_stmt_execute($stmt)) {
                    echo json_encode(["success" => "Product Updated Successfully"]);
                } else {
                    echo json_encode(["error" => "Failed to update product"]);
                }
                mysqli_stmt_close($stmt);
            } else {
                echo json_encode(["error" => "Invalid data"]);
            }
        } else {
            // Handle JSON data (fallback)
            $input = json_decode(file_get_contents("php://input"));
            if ($input && isset($input->id, $input->ptitle, $input->pprice, $input->status)) {
                $pid = $input->id;
                $ptitle = $input->ptitle;
                $pprice = $input->pprice;
                $status = $input->status;

                $stmt = mysqli_prepare($db_conn, "UPDATE tbl_product SET ptitle = ?, pprice = ?, pstatus = ? WHERE p_id = ?");
                mysqli_stmt_bind_param($stmt, "ssii", $ptitle, $pprice, $status, $pid);

                if (mysqli_stmt_execute($stmt)) {
                    echo json_encode(["success" => "Product Updated Successfully"]);
                } else {
                    echo json_encode(["error" => "Failed to update product"]);
                }
                mysqli_stmt_close($stmt);
            } else {
                echo json_encode(["error" => "Invalid data"]);
            }
        }
        break;

    case "DELETE":
        $path = explode('/', $_SERVER['REQUEST_URI']);

        if (isset($path[4]) && is_numeric($path[4])) {
            $pid = $path[4];

            $stmt = mysqli_prepare($db_conn, "DELETE FROM tbl_product WHERE p_id = ?");
            mysqli_stmt_bind_param($stmt, "i", $pid);

            if (mysqli_stmt_execute($stmt)) {
                echo json_encode(["success" => "Product Deleted Successfully"]);
            } else {
                echo json_encode(["error" => "Failed to delete product"]);
            }
            mysqli_stmt_close($stmt);
        } else {
            echo json_encode(["error" => "Invalid product ID"]);
        }
        break;

    default:
        echo json_encode(["error" => "Invalid Method"]);
        break;
}

mysqli_close($db_conn);
?>
