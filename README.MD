# Project Backend M4yby

### Requirement

- NodeJS v14.x
- Yarn v1.x
- MySQL

### Enviroment

- Create file /config/.env with content:

```sh
PORT =
SECRET_TOKEN =
TOKEN_EXPIRE =
SECRET_REFRESH_TOKEN =
REFRESH_TOKEN_EXPIRE =
SMTP_EMAIL =
SMTP_PASSWORD =
FROM_NAME =
FROM_EMAIL =
FOLDER_DEFAULT = "./public/images"
```

### Installation

```sh
$ yarn
```

### Setup database

- Step 1:

```sh
$ create database db_m4yby
```

- Step 2:

```sh
Change user and password database in /config/config.json
```

- Step 3:

```sh
$ sequelize db:migrate
```

- Step 4:

```sh
$ sequelize db:seed:all
```

- Step 5:

```sh
$ create folder "public/images"
```

### Run

```sh
$ yarn run dev
```
