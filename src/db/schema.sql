IF OBJECT_ID(N'dbo.places', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.places (
        id NVARCHAR(64) NOT NULL PRIMARY KEY,
        name NVARCHAR(255) NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL,
        level_type NVARCHAR(20) NOT NULL,
        description NVARCHAR(MAX) NULL,
        created_at DATETIME2 NOT NULL CONSTRAINT DF_places_created_at DEFAULT (SYSUTCDATETIME())
    );
END;
