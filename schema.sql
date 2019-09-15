CREATE TABLE todos(
    id SERIAL,
    username VARCHAR(255) NOT NULL,
    todo VARCHAR(255) NOT NULL,
    completed BOOLEAN NOT NULL,
    PRIMARY KEY (id)
);
