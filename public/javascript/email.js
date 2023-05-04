function SendMail(event) {
  event.preventDefault();
  console.log("click");
  var fname = document.getElementById('fname').value
  var lname = document.getElementById('lname').value
  var email_id = document.getElementById('email').value
  var message = document.getElementById('text').value
  if (fname == ""||lname == ""||email_id == ""||message == ""){
    alert("make sure all forms are filled before sending");
  }else if(!email_id.includes("@")){
    alert("make sure you have a valid email address");
  }else{
    var params = {
      from_name : fname + " " + lname,
      email_id : email_id,
      message : message
      }
      emailjs.send("service_ys1pr86","template_phkkx18", params).then(function(res){
        alert("success!" + res.status);
   })
  console.log(fname,lname,email_id,message);
  document.getElementById('fname').value = "";
  document.getElementById('lname').value = "";
  document.getElementById('email').value = "";
  document.getElementById('text').value = "";
  }
}

window.addEventListener('load', function() {
  var button = document.getElementById('contact-submit');
  button.disabled = false;
});