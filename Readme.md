personal project

flask

CREATE DATABASE dennikov;
use  dennikov;
source forum_dennikov_2006.sql;


sudo mysql -u root
sudo mysql -u root -p
mysql> 

1) /etc/sudoers
2) если удается сразу, то потом лучше всего сделать пароль, а то потом мороки без пароля - не открывается.
sudo mysql
mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
(or)
ALTER USER 'root'@'localhost' IDENTIFIED WITH caching_sha2_password BY 'password';
select user,host,plugin from mysql.user;

mysql> CREATE DATABASE dennikov;
mysql> use  dennikov;
mysql> source forum_dennikov_2006.sql; (путь к файлу)
or
docker cp .\forum_dennikov_2006.sql bd01954db700:/forum_dennikov_2006.sql
or
mysql -u root -f -p dennikov < /forum_dennikov_2006.sql

3) MySQL uses port 3306 by default. Можно открывать dbeaver, коннекшн на базу dennikov с паролем и портом



docker run --rm -it dimitri/pgloader:latest     pgloader        mysql://root:password@localhost/dennikov       pgsql://user:password@localhost/aiohttp_draft

docker run --rm -it dimitri/pgloader:latest pgloader mysql://root:password@localhost:3307/dennikov postgresql://user:password@localhost:5435/aiohttp_draft

docker run --rm -it --network host dimitri/pgloader:latest pgloader mysql://root:password@localhost:3307/dennikov postgresql://user:password@localhost:5435/aiohttp_draft

docker run --rm -it --network host dimitri/pgloader:latest pgloader mysql://newuser:new_password@127.0.0.1:3307/dennikov postgresql://user:password@localhost:5435/aiohttp_draft



docker run -p 3307:3306 --name forum_view_db_1 -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=dennikov -d mysql

