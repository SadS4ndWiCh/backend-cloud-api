# 🥿 backend-cloud-api

An API that serves as an simple cloud backup system.

## 🧵 Features

- Authentication;
- Upload files up to 200MB;
- Download uploaded files; and
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
               | *
               |              * + --------- + 1        * + ----------- +
               + -------------- |   FOLDER  | ---------- |     FILE    |
                                + --------- +            + ----------- +
                                | - ID      |            | - ID        |
                                | - Name    |            | - File Path |
                                | - User ID |            | - Folder ID |
                                + --------- +            + ----------- +
```