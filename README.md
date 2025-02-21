# Gerenciamento de Repositórios do GitHub

Imagine criar uma plataforma que permita aos usuários pesquisar e gerenciar facilmente os repositórios do GitHub. Este desafio envolve a criação de um aplicativo web com duas telas distintas e um backend para processamento de dados em segundo plano, afim de atestar o conhecimento em jobs em segundo plano utilizando fila, banco de dados e api rest.

## Requisitos:

### Tela 1: Pesquisa e Exportação

Deve fornecer uma barra de pesquisa que permite aos usuários buscar por um usuário do GitHub.
Ao selecionar um usuário, deve exibir todos os seus repositórios.
Deve incluir um botão para exportar todos os repositórios do usuário no formato CSV.

### Tela 2: Importação e Visualização

Deve conter um botão para importar os repositórios exportados da tela anterior.
Deve exibir uma tabela com os repositórios importados, incluindo o nome do repositório, o nome do proprietário e a quantidade de estrelas do repositório.
Deve persistir os dados importados no banco de dados.

## Backend:

Processar os dados importados usando jobs em segundo plano e uma fila com RabbitMQ.
Notificar o frontend quando o processamento estiver completo.
Recursos Adicionais Desejáveis:
Implementar filtros para os campos da tabela, permitindo aos usuários refinar sua visualização.
Deploy
Faça um passo a passo do processo de execução do projeto, lembrando da obrigatoriedade do uso de Docker

## Tecnologias Obrigatorias:

- Typescript
- Docker
- MariaDB
- React
- RabbitMQ

## Solução

- Rodar script em Scripts/start.hs com o comando build `sh ./Scripts/start.sh build` ou alternativamente rodar `docker compose up -d --build`
- Accessar localhost:3000

![image](https://github.com/user-attachments/assets/7d390322-0cce-44dc-b7b7-d6088b3b89f2)
![image](https://github.com/user-attachments/assets/b0678f69-1634-41f7-b815-3d2d9c487b49)
![image](https://github.com/user-attachments/assets/702c032c-fedc-4669-8b32-8c5c6e33415a)
![image](https://github.com/user-attachments/assets/01ab35d8-c61c-4dd9-b6a0-1cc4de56e9dd)
![image](https://github.com/user-attachments/assets/12c4dd09-67a4-4b25-9bdb-c0891d339507)




