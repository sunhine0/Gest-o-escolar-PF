<?php 

$Host = 'localhost';
$User = 'root';
$password = '';
$name = 'gestao_escolar'; // Nome do banco de dados

// Criando conexão com o banco de dados
$conexao = new mysqli($Host, $User, $password, $name);

// Verificando se há erro na conexão
if ($conexao->connect_error) {
    die("Erro de conexão: " . $conexao->connect_error);
}

?>
