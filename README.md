# Projeto - Mapeamento Ambiental

## Descrição

Sistema para mapeamento ambiental, com API (NestJS), aplicação web (Next.js) e banco de dados PostgreSQL.

Ao acessar a aplicação ([http://localhost:3000](http://localhost:3000)), um mapa do mundo é apresentado sem nenhuma marcação. No canto superior direito, o botão **"Criar projeto"** leva para um formulário onde é possível criar um novo projeto.

Vale ressaltar que é muito importante sempre verificar se o nome do projeto está disponível.

Além disso, as coordenadas devem ser inseridas no formato `[num, num]`.
**Dica:** utilize o Google Maps para pegar a coordenada desejada com o botão direito do mouse.
Após criar o projeto, o usuário é redirecionado para a tela do mapa, com os projetos listados à esquerda.

Ao clicar em um projeto, o mapa foca exatamente na localização do mesmo.
**Dica:** Crie projetos próximos, dessa forma a animação de troca de coordenadas do mapa fica mais fluida :)

## Instruções de uso

1. **Clone o repositório**
2. **Crie o arquivo `.env`** conforme o exemplo disponível em `.envexample` na pasta `mapeamento-api`.
3. **Na raiz do projeto**, execute:
   ```
   docker-compose up --build
   ```
   Isso irá criar e iniciar todos os containers necessários para rodar a aplicação.

> **OBS:**
> É necessário criar manualmente os status **"Ativo"** e **"Finalizado"** na tabela `Status` do banco de dados após a primeira execução.

---

## Documentação da API

Para visualizar a documentação Swagger localmente, execute o comando abaixo **no diretório da API (`mapeamento-api`)**:

```
npx swagger-ui-watcher swagger.json
```

Depois, acesse [http://localhost:8000](http://localhost:8000) no seu navegador.

---

## Testes Unitários

**no diretório da API (`mapeamento-api`)**, rode o comando abaixo para executar os testes dos serviços:

```
npm run test
```

---

## Tecnologias utilizadas

- **API:** NestJS
- **Frontend:** Next.js
- **Banco de dados:** PostgreSQL
- **ORM:** PrismaORM
- **Docker**
