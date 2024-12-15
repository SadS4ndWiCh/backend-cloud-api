# 🥿 backend-cloud-api

An API that serves as a simple cloud backup system.

## 🧵 Features

- Authentication;
- Upload files up to 200MB;
- Download uploaded files;
- Create folders to hold files;

## 🎗️ Entities

```
       + ----------- +           + ------------ +
       |     USER    |           |    SESSION   |
       + ----------- +           + ------------ +
       | - ID        | 1       * | - ID         |
       | - Full Name | --------- | - Expires At |
       | - Email     |           | - User ID    |
       | - Password  |           + ------------ +
       + ----------- +
               | 1
               |              * + ------------ + 1        * + ----------- +
               + -------------- |   FOLDER     | ---------- |     FILE    |
                                + ------------ +            + ----------- +
                                | - ID         |            | - ID        |
                                | - Name       |            | - File Path |
                                | - Visibility |            | - Folder ID |
                                | - User ID    |            + ----------- +
                                + ------------ +            
```

## 🪜 Use Cases

### Create user account

1. User sends the full name, email and password;
2. Server creates the account and the session;
3. User receives your session id;

2.a If server fails to create account, finish the use case;

### Login

1. User sends the email and password;
2. Server validates the credentials;
3. Server creates the session
4. User receives your session id;

2.a If user provides invalid credentials, finish the use case;

### Upload file

1. User upload a file;
2. Server validate the file;
3. Server places the file in the folder;
4. User receives the file id;

2.a If the file is invalid (larger than 200MB), finish the use case;
3.a If any folder was specified, places it in the default folder;

### Download uploaded file

1. User sends the id of the file that wants to download;
2. Server check if file exists;
3. Server stream the file;
4. User download the file;

2.a If file don't exists, finish the use case;

### Move file to folder

1. User sends the file id and the folder id;
2. Server check if both file and folder exists;
3. Server attach the file to the folder;

2.a If file or folder don't exists, finish the use case;