let  watch_forum = function(btn) {
    // $.get("/topics/" + forum_id.toString())
    let forumId = $(btn).data('forum-id');
    window.open("/topics/" + forumId.toString(), "_self");
  };


  let  watch_topic = function(btn) {
    // $.get("/topics/" + forum_id.toString())
    let forumId = $('#forum_id').data('forum-id');
    let topicId = $(btn).data('id');
    window.open("/topics/" + forumId.toString() + '/' + topicId.toString(), "_self");
  };


  let watch_user  = function(btn) {
    let forumId = $('#topic_id').data('forum-id');
    let topicId = $('#topic_id').data('topic-id');
    let userId = $(btn).data('user-id');
    window.open("/users/" + userId.toString() + "?forumId=" + forumId +"&topicId="+ topicId, "_self");
  }

  let return_to_main = function() {
    // let forumId = $(btn).data('forum-id');
    window.open("/", "_self");
  }

//   let  watch_forum = function(btn) {
//     // $.get("/topics/" + forum_id.toString())
//     let forumId = $(btn).data('id');
//     window.open("/topics/" + forumId.toString(),"_self");
//   };
