-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_folders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "visiblity" INTEGER NOT NULL DEFAULT 0,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "folders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_folders" ("id", "name", "user_id") SELECT "id", "name", "user_id" FROM "folders";
DROP TABLE "folders";
ALTER TABLE "new_folders" RENAME TO "folders";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
