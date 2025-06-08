personal project

flask

CREATE DATABASE dennikov;
use  dennikov;
source forum_dennikov_2006.sql;


sudo mysql -u root
mysql> 

1) /etc/sudoers
2) если удается сразу, то потом лучше всего сделать пароль, а то потом мороки без пароля - не открывается.
sudo mysql
mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
mysql> CREATE DATABASE dennikov;
mysql> use  dennikov;
mysql> source forum_dennikov_2006.sql; (путь к файлу)
3) MySQL uses port 3306 by default. Можно открывать dbeaver, коннекшн на базу dennikov с паролем и портом