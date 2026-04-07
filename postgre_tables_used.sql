-- DROP TABLE dennikov.phpbb_1categories;

CREATE TABLE dennikov.phpbb_1categories (
	cat_id serial4 NOT NULL,
	cat_title varchar(100) NULL,
	cat_order int4 NOT NULL DEFAULT 0,
	cat_main_type bpchar(1) NULL,
	cat_main int4 NOT NULL DEFAULT 0,
	cat_desc text NOT NULL,
	CONSTRAINT idx_16603_primary PRIMARY KEY (cat_id)
);
CREATE INDEX idx_16603_cat_order ON dennikov.phpbb_1categories USING btree (cat_order);


-- DROP TABLE dennikov.phpbb_1users;

CREATE TABLE dennikov.phpbb_1users (
	user_id int4 NOT NULL DEFAULT 0,
	user_active bool NULL DEFAULT true,
	username varchar(25) NOT NULL DEFAULT ''::character varying,
	user_password varchar(32) NOT NULL DEFAULT ''::character varying,
	user_session_time int4 NOT NULL DEFAULT 0,
	user_session_page int2 NOT NULL DEFAULT '0'::smallint,
	user_lastvisit int4 NOT NULL DEFAULT 0,
	user_regdate int4 NOT NULL DEFAULT 0,
	user_level int2 NULL DEFAULT '0'::smallint,
	user_posts int4 NOT NULL DEFAULT 0,
	user_timezone numeric(5, 2) NOT NULL DEFAULT 0.00,
	user_style int2 NULL,
	user_lang varchar(255) NULL,
	user_dateformat varchar(14) NOT NULL DEFAULT 'd M Y H:i'::character varying,
	user_new_privmsg int4 NOT NULL DEFAULT 0,
	user_unread_privmsg int4 NOT NULL DEFAULT 0,
	user_last_privmsg int4 NOT NULL DEFAULT 0,
	user_login_tries int4 NOT NULL DEFAULT 0,
	user_last_login_try int4 NOT NULL DEFAULT 0,
	user_emailtime int4 NULL,
	user_viewemail bool NULL,
	user_attachsig bool NULL,
	user_allowhtml bool NULL DEFAULT true,
	user_allowbbcode bool NULL DEFAULT true,
	user_allowsmile bool NULL DEFAULT true,
	user_allowavatar bool NOT NULL DEFAULT true,
	user_allow_pm bool NOT NULL DEFAULT true,
	user_allow_viewonline bool NOT NULL DEFAULT true,
	user_notify bool NOT NULL DEFAULT true,
	user_notify_pm bool NOT NULL DEFAULT false,
	user_popup_pm bool NOT NULL DEFAULT false,
	user_rank int4 NULL DEFAULT 0,
	user_avatar varchar(100) NULL,
	user_avatar_type int2 NOT NULL DEFAULT '0'::smallint,
	user_email varchar(255) NULL,
	user_icq varchar(15) NULL,
	user_website varchar(100) NULL,
	user_from varchar(100) NULL,
	user_sig text NULL,
	user_sig_bbcode_uid varchar(10) NULL,
	user_aim varchar(255) NULL,
	user_yim varchar(255) NULL,
	user_msnm varchar(255) NULL,
	user_occ varchar(100) NULL,
	user_interests varchar(255) NULL,
	user_actkey varchar(32) NULL,
	user_newpasswd varchar(32) NULL,
	CONSTRAINT idx_16638_primary PRIMARY KEY (user_id)
);
CREATE INDEX idx_16638_user_password ON dennikov.phpbb_1users USING gin (to_tsvector('simple'::regconfig, (user_password)::text));
CREATE INDEX idx_16638_user_password_2 ON dennikov.phpbb_1users USING btree (user_password);
CREATE INDEX idx_16638_user_password_3 ON dennikov.phpbb_1users USING btree (user_password);
CREATE INDEX idx_16638_user_session_time ON dennikov.phpbb_1users USING btree (user_session_time);



CREATE TABLE dennikov.phpbb_1forums (
	forum_id int4 NOT NULL DEFAULT 0,
	cat_id int4 NOT NULL DEFAULT 0,
	forum_name varchar(150) NULL,
	forum_desc text NULL,
	forum_status int2 NOT NULL DEFAULT '0'::smallint,
	forum_order int4 NOT NULL DEFAULT 1,
	forum_posts int4 NOT NULL DEFAULT 0,
	forum_topics int4 NOT NULL DEFAULT 0,
	forum_last_post_id int4 NOT NULL DEFAULT 0,
	prune_next int4 NULL,
	prune_enable int4 NOT NULL DEFAULT 0,
	auth_view int2 NOT NULL DEFAULT '0'::smallint,
	auth_read int2 NOT NULL DEFAULT '0'::smallint,
	auth_post int2 NOT NULL DEFAULT '0'::smallint,
	auth_reply int2 NOT NULL DEFAULT '0'::smallint,
	auth_edit int2 NOT NULL DEFAULT '0'::smallint,
	auth_delete int2 NOT NULL DEFAULT '0'::smallint,
	auth_sticky int2 NOT NULL DEFAULT '0'::smallint,
	auth_announce int2 NOT NULL DEFAULT '0'::smallint,
	auth_vote int2 NOT NULL DEFAULT '0'::smallint,
	auth_pollcreate int2 NOT NULL DEFAULT '0'::smallint,
	auth_attachments int2 NOT NULL DEFAULT '0'::smallint,
	forum_link varchar(255) NULL,
	forum_link_internal int4 NOT NULL DEFAULT 0,
	forum_link_hit_count int4 NOT NULL DEFAULT 0,
	forum_link_hit int8 NOT NULL DEFAULT '0'::bigint,
	main_type bpchar(1) NULL,
	CONSTRAINT idx_16946_primary PRIMARY KEY (forum_id)
);
CREATE INDEX idx_16946_cat_id ON dennikov.phpbb_1forums USING btree (cat_id);
CREATE INDEX idx_16946_forum_last_post_id ON dennikov.phpbb_1forums USING btree (forum_last_post_id);
CREATE INDEX idx_16946_forums_order ON dennikov.phpbb_1forums USING btree (forum_order);


-- DROP TABLE dennikov.phpbb_1topics;

CREATE TABLE dennikov.phpbb_1topics (
	topic_id serial4 NOT NULL,
	forum_id int4 NOT NULL DEFAULT 0,
	topic_title bpchar(60) NOT NULL DEFAULT ''::bpchar,
	topic_poster int4 NOT NULL DEFAULT 0,
	topic_time int4 NOT NULL DEFAULT 0,
	topic_views int4 NOT NULL DEFAULT 0,
	topic_replies int4 NOT NULL DEFAULT 0,
	topic_status int2 NOT NULL DEFAULT '0'::smallint,
	topic_vote int2 NOT NULL DEFAULT '0'::smallint,
	topic_type int2 NOT NULL DEFAULT '0'::smallint,
	topic_first_post_id int4 NOT NULL DEFAULT 0,
	topic_last_post_id int4 NOT NULL DEFAULT 0,
	topic_moved_id int4 NOT NULL DEFAULT 0,
	CONSTRAINT idx_17204_primary PRIMARY KEY (topic_id)
);
CREATE INDEX idx_17204_forum_id ON dennikov.phpbb_1topics USING btree (forum_id);
CREATE INDEX idx_17204_topic_moved_id ON dennikov.phpbb_1topics USING btree (topic_moved_id);
CREATE INDEX idx_17204_topic_status ON dennikov.phpbb_1topics USING btree (topic_status);
CREATE INDEX idx_17204_topic_type ON dennikov.phpbb_1topics USING btree (topic_type);


-- DROP TABLE dennikov.phpbb_1posts;

CREATE TABLE dennikov.phpbb_1posts (
	post_id serial4 NOT NULL,
	topic_id int4 NOT NULL DEFAULT 0,
	forum_id int4 NOT NULL DEFAULT 0,
	poster_id int4 NOT NULL DEFAULT 0,
	post_time int4 NOT NULL DEFAULT 0,
	poster_ip varchar(8) NOT NULL DEFAULT ''::character varying,
	post_username varchar(25) NULL,
	enable_bbcode bool NOT NULL DEFAULT true,
	enable_html bool NOT NULL DEFAULT false,
	enable_smilies bool NOT NULL DEFAULT true,
	enable_sig bool NOT NULL DEFAULT true,
	post_edit_time int4 NULL,
	post_edit_count int4 NOT NULL DEFAULT 0,
	CONSTRAINT idx_16612_primary PRIMARY KEY (post_id)
);
CREATE INDEX idx_16612_forum_id ON dennikov.phpbb_1posts USING btree (forum_id);
CREATE INDEX idx_16612_post_time ON dennikov.phpbb_1posts USING btree (post_time);
CREATE INDEX idx_16612_poster_id ON dennikov.phpbb_1posts USING btree (poster_id);
CREATE INDEX idx_16612_topic_id ON dennikov.phpbb_1posts USING btree (topic_id);


-- dennikov.phpbb_1posts_text definition

-- Drop table

-- DROP TABLE dennikov.phpbb_1posts_text;

CREATE TABLE dennikov.phpbb_1posts_text (
	post_id int4 NOT NULL DEFAULT 0,
	bbcode_uid varchar(10) NOT NULL DEFAULT ''::character varying,
	post_subject varchar(60) NULL,
	post_text text NULL,
	CONSTRAINT idx_16626_primary PRIMARY KEY (post_id)
);


-- DROP TABLE dennikov.phpbb_1vote_desc;

CREATE TABLE dennikov.phpbb_1vote_desc (
	vote_id serial4 NOT NULL,
	topic_id int4 NOT NULL DEFAULT 0,
	vote_text text NOT NULL,
	vote_start int4 NOT NULL DEFAULT 0,
	vote_length int4 NOT NULL DEFAULT 0,
	CONSTRAINT idx_16672_primary PRIMARY KEY (vote_id)
);
CREATE INDEX idx_16672_topic_id ON dennikov.phpbb_1vote_desc USING btree (topic_id);


-- dennikov.phpbb_1vote_results definition

-- Drop table

-- DROP TABLE dennikov.phpbb_1vote_results;

CREATE TABLE dennikov.phpbb_1vote_results (
	vote_id int4 NOT NULL DEFAULT 0,
	vote_option_id int2 NOT NULL DEFAULT '0'::smallint,
	vote_option_text varchar(255) NOT NULL DEFAULT ''::character varying,
	vote_result int4 NOT NULL DEFAULT 0
);
CREATE INDEX idx_16681_vote_id ON dennikov.phpbb_1vote_results USING btree (vote_id);
CREATE INDEX idx_16681_vote_option_id ON dennikov.phpbb_1vote_results USING btree (vote_option_id);


-- dennikov.phpbb_1vote_voters definition

-- Drop table



CREATE TABLE dennikov.phpbb_1smilies (
	smilies_id serial4 NOT NULL,
	code varchar(50) NULL,
	smile_url varchar(100) NULL,
	emoticon varchar(75) NULL,
	CONSTRAINT idx_16798_primary PRIMARY KEY (smilies_id)
);

INSERT INTO dennikov.phpbb_1smilies (code,smile_url,emoticon) VALUES
    (':D','icon_biggrin.gif','Very Happy'),
    (':-D','icon_biggrin.gif','Very Happy'),
    (':grin:','icon_biggrin.gif','Very Happy'),
    (':)','icon_smile.gif','Smile'),
    (':-)','icon_smile.gif','Smile'),
    (':smile:','icon_smile.gif','Smile'),
    (':(','icon_sad.gif','Sad'),
    (':-(','icon_sad.gif','Sad'),
    (':sad:','icon_sad.gif','Sad'),
    (':o','icon_surprised.gif','Surprised');
INSERT INTO dennikov.phpbb_1smilies (code,smile_url,emoticon) VALUES
    (':-o','icon_surprised.gif','Surprised'),
    (':eek:','icon_surprised.gif','Surprised'),
    (':shock:','icon_eek.gif','Shocked'),
    (':?','icon_confused.gif','Confused'),
    (':-?','icon_confused.gif','Confused'),
    (':???:','icon_confused.gif','Confused'),
    ('8)','icon_cool.gif','Cool'),
    ('8-)','icon_cool.gif','Cool'),
    (':cool:','icon_cool.gif','Cool'),
    (':lol:','icon_lol.gif','Laughing');
INSERT INTO dennikov.phpbb_1smilies (code,smile_url,emoticon) VALUES
    (':x','icon_mad.gif','Mad'),
    (':-x','icon_mad.gif','Mad'),
    (':mad:','icon_mad.gif','Mad'),
    (':P','icon_razz.gif','Razz'),
    (':-P','icon_razz.gif','Razz'),
    (':razz:','icon_razz.gif','Razz'),
    (':oops:','icon_redface.gif','Embarassed'),
    (':cry:','icon_cry.gif','Crying or Very sad'),
    (':evil:','icon_evil.gif','Evil or Very Mad'),
    (':twisted:','icon_twisted.gif','Twisted Evil');
INSERT INTO dennikov.phpbb_1smilies (code,smile_url,emoticon) VALUES
    (':roll:','icon_rolleyes.gif','Rolling Eyes'),
    (':wink:','icon_wink.gif','Wink'),
    (';)','icon_wink.gif','Wink'),
    (';-)','icon_wink.gif','Wink'),
    (':!:','icon_exclaim.gif','Exclamation'),
    (':?:','icon_question.gif','Question'),
    (':idea:','icon_idea.gif','Idea'),
    (':arrow:','icon_arrow.gif','Arrow'),
    (':|','icon_neutral.gif','Neutral'),
    (':-|','icon_neutral.gif','Neutral');
INSERT INTO dennikov.phpbb_1smilies (code,smile_url,emoticon) VALUES
    (':neutral:','icon_neutral.gif','Neutral'),
    (':mrgreen:','icon_mrgreen.gif','Mr. Green'),
    ('=D&gt;','eusa_clap.gif','Applause'),
    ('#-o','eusa_doh.gif','d''oh!'),
    ('=P~','eusa_drool.gif','Drool'),
    (':^o','eusa_liar.gif','Liar'),
    (':---)','eusa_liar.gif','Liar'),
    ('[-X','eusa_naughty.gif','Shame on you'),
    ('[-o&lt;','eusa_pray.gif','Pray'),
    ('8-[','eusa_shifty.gif','Anxious');
INSERT INTO dennikov.phpbb_1smilies (code,smile_url,emoticon) VALUES
    ('[-(','eusa_snooty.gif','Not talking'),
    (':-k','eusa_think.gif','Think'),
    ('](*,)','eusa_wall.gif','Brick wall'),
    (':-"','eusa_whistle.gif','Whistle'),
    ('O:)','eusa_angel.gif','Angel'),
    ('=;','eusa_hand.gif','Speak to the hand'),
    (':-&','eusa_sick.gif','Sick'),
    (':-({|=','eusa_boohoo.gif','Boo hoo!'),
    (':-$','eusa_shhh.gif','Shhh'),
    (':-s','eusa_eh.gif','Eh?');
INSERT INTO dennikov.phpbb_1smilies (code,smile_url,emoticon) VALUES
    ('\:D/','eusa_dance.gif','Dancing'),
    (':-#','eusa_silenced.gif','Silenced'),
    (':gans:','2gunsfiring_v1.gif','gunsfiring'),
    (':angel:','angel.gif','Angel'),
    (':argue:','argue.gif','Argue'),
    (':asthanos:','asthanos.gif','asthanos'),
    (':bdays:','bdaysmile.gif','Bdaysmile'),
    (':birthday:','birthday.gif','Birthday'),
    (':black:','blackey.gif','Blackey'),
    (':blow:','blowingup.gif','Blowingup');
INSERT INTO dennikov.phpbb_1smilies (code,smile_url,emoticon) VALUES
    (':blue:','bluegrab.gif','Bluegrab'),
    (':butterfly:','butterfly.gif','Butterfly'),
    (':color:','color_.gif','Color'),
    (':eyecrazy:','Eyecrazy.gif','Eyecrazy'),
    (':gmorning:','gmorning.gif','GoodMorning'),
    (':icecream:','icecream.gif','IceCream'),
    (':let_it:','let_it_all_out.gif','let_it_all_out'),
    (':llying:','llying.gif','llying'),
    (':multi:','multi.gif','Multi'),
    (':puppy:','puppy_dog_eyes.gif','PuppyDog');
INSERT INTO dennikov.phpbb_1smilies (code,smile_url,emoticon) VALUES
    (':rainfro:','rainfro.gif','Rainfro'),
    (':scatter:','scatter.gif','Scatter'),
    (':scrambles:','scrambles.gif','Scrambles'),
    (':shocked:','shocked.gif','Shocked'),
    (':silly:','silly.gif','Silly'),
    (':sleep:','sleeping.gif','Sleeping'),
    (':smilel:','smile-l.gif','Smile'),
    (':smileyb:','smileyb.gif','SmileYB'),
    (':sm_color:','smilie_colors1.gif','smilie_color'),
    (':sniper:','snipersmilie.gif','snipersmilie');
INSERT INTO dennikov.phpbb_1smilies (code,smile_url,emoticon) VALUES
    (':spiral:','spiral.gif','Spiral'),
    (':tomato:','tomato.gif','Tomato'),
    (':ukliam:','ukliam2.gif','Ukliam'),
    (':xmas:','xmas.gif','Kristmas'),
    (':door:','aaa.gif','Door'),
    (':adr:','adr.gif',''),
    (':alc:','alc.gif','Alcohol'),
    (':apl:','apl.gif','Aplle'),
    (':app:','appl.gif','Applodismenty'),
    (':att:','att.gif','');
INSERT INTO dennikov.phpbb_1smilies (code,smile_url,emoticon) VALUES
    (':au:','au.gif','Au'),
    (':bam:','bam.gif','BAM'),
    (':bath:','bath.gif','Bathroom'),
    (':bee:','bee.gif',''),
    (':bird:','bird.gif','Bird'),
    (':bis:','bis.gif','bis'),
    (':box:','box.gif','box'),
    (':box2:','box2.gif','box'),
    (':brsh:','brsh.gif','brush'),
    (':brsh1:','brsh1.gif','brush');
INSERT INTO dennikov.phpbb_1smilies (code,smile_url,emoticon) VALUES
    (':bubu:','bubu.gif','Bu'),
    (':bud:','bud.gif','Budenovech'),
    (':bur:','bur2.gif','burya'),
    (':crazy:','crazy.gif','Crazy'),
    (':croc:','croc.gif','crocodil'),
    (':dan:','dan.gif','Dance'),
    (':daz:','daz.gif',''),
    (':drv:','drv.gif','drovosek'),
    (':dsv:','dsv.gif',''),
    (':duel:','duel.gif','Duel');
INSERT INTO dennikov.phpbb_1smilies (code,smile_url,emoticon) VALUES
    (':fart:','fart.gif',''),
    (':figa:','figa.gif','Figa'),
    (':fkr:','fkr.gif',''),
    (':fly:','fly.gif','Fly'),
    (':fol:','fol.gif',''),
    (':frfr:','frfr.gif',''),
    (':gaz:','gaz.gif','Gazeta'),
    (':girl:','girl.gif','Girl'),
    (':git:','git.gif','Gitara'),
    (':goss:','goss.gif','');
INSERT INTO dennikov.phpbb_1smilies (code,smile_url,emoticon) VALUES
    (':gost:','gost.gif','Gost'),
    (':hah:','hah.gif','hah'),
    (':hb:','hb.gif','hb'),
    (':hit:','hit.gif','hit'),
    (':hlp:','hlp.gif','hlp'),
    (':hmm:','hmm.gif','hmm'),
    (':hug:','hug.gif','hug'),
    (':inc:','inc.gif','inc'),
    (':iq:','iq.gif',''),
    (':ivn:','ivn.gif','Ivanushka');
INSERT INTO dennikov.phpbb_1smilies (code,smile_url,emoticon) VALUES
    (':jok:','jok.gif','jok'),
    (':kar:','kar.gif','karate'),
    (':kngt:','kngt.gif',''),
    (':kto:','kto.gif','kto tam'),
    (':kuku:','kuku.gif','kuku'),
    (':kuli:','kuli.gif','kuli'),
    (':kult:','kult.gif',''),
    (':lam:','lam.gif','Lamer'),
    (':leb:','leb.gif','Lebedi'),
    (':lu:','lu.gif','Lubov');
INSERT INTO dennikov.phpbb_1smilies (code,smile_url,emoticon) VALUES
    (':ma:','ma.gif','Mama'),
    (':mail:','mail.gif','Mail'),
    (':man:','man.gif',''),
    (':mar:','mar.gif','Marrige'),
    (':mat:','mat.gif','Matros'),
    (':mob:','mob.gif','Mobila'),
    (':mpr:','mpr.gif',''),
    (':much:','much.gif',''),
    (':nap:','nap.gif','Napoleon'),
    (':newy:','newy.gif','New Year');
INSERT INTO dennikov.phpbb_1smilies (code,smile_url,emoticon) VALUES
    (':nom:','nomail.gif','No mail'),
    (':nud:','nud.gif',''),
    (':nunu:','nunu.gif',''),
    (':obm:','obm.gif','Obmorok'),
    (':old:','old.gif','Starik'),
    (':otk:','otk.gif','Otkazat'''),
    (':pauk:','pauk.gif','Pauk'),
    (':pom:','pom.gif','Pomidor'),
    (':pop:','pop.gif','Pop'),
    (':popc1:','popc1.gif','Popcorn');
INSERT INTO dennikov.phpbb_1smilies (code,smile_url,emoticon) VALUES
    (':poz:','poz.gif','Pozdravlenie'),
    (':pri:','pri.gif',''),
    (':pya:','pya.gif','Pyan'''),
    (':repa:','repa.gif','Repa'),
    (':rev:','rev.gif','reverans'),
    (':reve:','revenant.gif',''),
    (':rog:','rog.gif','Rog'),
    (':ser:','ser.gif','Serenada'),
    (':shar:','shar.gif','Sharik'),
    (':sharm:','sharm.gif','Sharmanka');
INSERT INTO dennikov.phpbb_1smilies (code,smile_url,emoticon) VALUES
    (':shv:','shv.gif','shveik'),
    (':shy:','shy.gif',''),
    (':sla:','sla.gif','Chupa-chups)'),
    (':sml:','sml.gif',''),
    (':str:','str.gif','Strax'),
    (':sumo:','sumo.gif','Sumo'),
    (':susel:','susel.gif',''),
    (':thk:','thk.gif','Think'),
    (':trud:','trud.gif','Trud'),
    (':tsr:','tsr.gif','Tseluu ruchku');
INSERT INTO dennikov.phpbb_1smilies (code,smile_url,emoticon) VALUES
    (':umn:','umn.gif','Umnik'),
    (':unknw:','unknw.gif','Unknow'),
    (':upl:','upl.gif','Uplocheno'),
    (':ura:','ura.gif','Ura'),
    (':val:','val.gif',''),
    (':ven:','ven.gif','Venera'),
    (':wht:','wht.gif',''),
    (':yar:','yar.gif',''),
    (':yaya:','yaya.gif',''),
    (':yel:','yel.gif','');
INSERT INTO dennikov.phpbb_1smilies (code,smile_url,emoticon) VALUES
    (':-"','eusa_whistle.gif','Whistle'),
    ('\:D/','eusa_dance.gif','Dancing');