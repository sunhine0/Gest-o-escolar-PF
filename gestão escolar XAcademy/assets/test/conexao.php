<?php 
$Host = 'localhost';  // Servidor do banco de dados
$User = 'root';       // Usuário do banco de dados (padrão no XAMPP e WAMP)
$password = '';       // Senha do banco (vazia por padrão no XAMPP)
$name = 'gestao_escolar'; // Nome do banco de dados

// Criando conexão com o banco de dados
$conexao = new mysqli($Host, $User, $password, $name);

// Verificando se há erro na conexão
if ($conexao->connect_error) {
    die("Erro de conexão: " . $conexao->connect_error);
}
?>
