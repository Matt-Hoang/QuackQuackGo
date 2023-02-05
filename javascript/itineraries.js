


/* === Itineraries Checklist === */

// Create a "close" button and append it to each list item
var myNodelist = document.getElementsByTagName("LI");
for (var i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

// Click on a close button to hide the current list item
var close = document.getElementsByClassName("close");
for (var i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    div.style.display = "none";
  }
}

// Add a "checked" symbol when clicking on a list item
var list = document.querySelectorAll('ul');
for (let i = 0; i < list.length; i++) {
  list[i].addEventListener('click', function(ev) {
    if (ev.target.tagName === 'LI') {
      ev.target.classList.toggle('checked');
    }
  }, false);
}

// Create a new list item when clicking on the "Add" button
function newElement() {
  var inputValue = document.getElementsByClassName("checklist-input")
  for (var i = 0; i < inputValue.length; i++) {
    var li = document.createElement("li");
    var t = document.createTextNode(inputValue[i].value);
    li.appendChild(t);
    if (inputValue[i].value === '') {
      alert("You must write something!");
    } else {
      var ul = document.getElementsByClassName("individual-checklist")
      for (var j = 0; j < ul.length; j++) {
        ul[j].appendChild(li);
      }
    }
    document.getElementsByClassName("checklist-input")[i].value = ""

    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);

    for (i = 0; i < close.length; i++) {
      close[i].onclick = function() {
        var div = this.parentElement;
        div.style.display = "none";
      }
    }
  } 

  // // use ID, works for one list but breaks for multi
  // var li = document.createElement("li");
  // var inputValue = document.getElementsByClassName("checklist-input").value;
  // var t = document.createTextNode(inputValue);
  // li.appendChild(t);
  // if (inputValue === '') {
  //   alert("You must write something!");
  // } else {
  //   document.getElementById("myUL").appendChild(li);
  // }
  // document.getElementById("myInput").value = "";

  // var span = document.createElement("SPAN");
  // var txt = document.createTextNode("\u00D7");
  // span.className = "close";
  // span.appendChild(txt);
  // li.appendChild(span);

  // for (i = 0; i < close.length; i++) {
  //   close[i].onclick = function() {
  //     var div = this.parentElement;
  //     div.style.display = "none";
  //   }
  // }
}