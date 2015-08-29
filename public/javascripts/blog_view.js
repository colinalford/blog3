var checkEnabled = document.getElementsByClassName('enable');
if (checkEnabled.length === 1) {
    var ed = document.getElementById('comment-editor');
    ed.removeAttribute('disabled');
    ed.value = '';
}

var pathArray = window.location.pathname.split('/');
var path = pathArray[3];
Comments.getComments(path).done(function(result) {
    Comments.renderComments(result);
})

var hr = document.getElementsByTagName('hr');
var blog_id_value = hr[0].getAttribute('id');
var form_input = document.getElementById('blog_id_input');
form_input.value = blog_id_value;
