## personal project (Forum, Flask)

> ! Форум является восстановленным, статическим - без регистрации, без паролей, открытый текст постов, тем и комментариев.


deploy: https://flaskdennikov--dennikov.replit.app/


<img width="1586" height="909" alt="image" src="https://github.com/user-attachments/assets/4e7f1ec9-1dce-417b-8058-36faf358d955" />


## Document endpoints:

- Main url
    -- URL: /
    -- Method: GET
    -- Description: Displays the main forum categories.
    -- Tables: dennikov.phpbb_1forums, dennikov.phpbb_1categories

- Document the posts view endpoint:
    -- URL: /topics/<forum_id>/<topic_id>
    -- Method: GET
    -- Description: Shows a list of posts in a specific topic within a forum.
    -- Tables: dennikov.phpbb_1posts, dennikov.phpbb_1posts_text, dennikov.phpbb_1topics, dennikov.phpbb_1users (and for votes: dennikov.phpbb_1vote_desc, dennikov.phpbb_1vote_results)

- Document the topics view endpoint:
    -- URL: /topics/<forum_id>
    -- Method: GET
    -- Description: Displays a list of topics in a specific forum.
    -- Tables: dennikov.phpbb_1topics, dennikov.phpbb_1forums

- Document the user view endpoint:
    -- URL: /users/<user_id>/
    -- Method: GET
    -- Description: Displays information about a specific user.
    -- Tables: dennikov.phpbb_1users


<details close="">
<summary>  
        
### personal notes

        

</summary> 

---- phpbb_1topics - id увеличивается с пропусками из таблицы! так надо

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


</details>
