CREATE DATABASE gestao_escolar;
USE gestao_escolar;

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    numero_celular VARCHAR(20) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    genero ENUM('Masculino', 'Feminino') NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
