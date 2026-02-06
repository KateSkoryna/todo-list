DROP
  DATABASE IF EXISTS fyltura;
CREATE
  DATABASE fyltura;
USE
fyltura;

CREATE TABLE todolist
(
  id   int  NOT NULL AUTO_INCREMENT,
  name text NOT NULL,
  PRIMARY KEY (id)
);

insert into todolist(name) values ('Todolist No. 1'), ('Todolist No. 2');
