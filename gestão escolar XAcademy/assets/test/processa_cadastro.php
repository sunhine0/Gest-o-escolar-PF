<?php 
include 'conexao.php'; // Importa a conexão com o banco

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nome_completo = $_POST['nome_completo'];
    $numero_celular = $_POST['numero_celular'];
    $email = $_POST['email'];
    $genero = $_POST['genero'];
    $senha = password_hash($_POST['senha'], PASSWORD_DEFAULT); // Criptografa a senha

    // Verifica se o e-mail já está cadastrado
    $sql_check = "SELECT id_usuario FROM usuarios WHERE email = '$email'";
    $result = $conexao->query($sql_check);

    if ($result->num_rows > 0) {
        echo "<script>alert('Este e-mail já está cadastrado!'); window.location.href='cadastro.html';</script>";
        exit();
    }

    // Insere os dados no banco de dados
    $sql = "INSERT INTO usuarios (nome_completo, numero_celular, email, genero, senha) 
            VALUES ('$nome_completo', '$numero_celular', '$email', '$genero', '$senha')";

    if ($conexao->query($sql) === TRUE) {
        echo "<script>alert('Cadastro realizado com sucesso!'); window.location.href='cadastro.html';</script>";
    } else {
        echo "Erro: " . $sql . "<br>" . $conexao->error;
    }
}

$conexao->close();
?>
