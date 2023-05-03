
function SendMail() {
  var params = {
      from_name : document.getElementById('fname').value + " " + document.getElementById('lname').value,
      email_id : document.getElementById('email').value,
      message : document.getElementById('text').value
  }
  emailjs.send("service_ys1pr86","template_phkkx18", params).then(function(res){
    alert("Email has been sent! We will get back to you shortly.");
  })
}