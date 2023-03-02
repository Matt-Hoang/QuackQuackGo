/*== adds close button to all locations ==*/
var myNodelist = document.getElementsByClassName("hamburger");
for (var i = 0; i < myNodelist.length; i++) {
  var but = document.createElement("button");
  var txt = document.createTextNode("\u00D7");
  but.className = "close-loc";
  but.appendChild(txt);
  myNodelist[i].appendChild(but);
}

// Click on a close button to hide the location item
var close = document.getElementsByClassName("close-loc");
for (var i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    var sdiv = div.parentElement;
    sdiv.style.display = "none";
  }
}

/*== Allows drag and drop to arrange order of locations ==*/
const sortableList = document.querySelector(".location-container");
const items = document.querySelectorAll(".location-item");

items.forEach(item => {
    item.addEventListener("dragstart", () => {
        //adding dragging class to item after a delay
        setTimeout(() => item.classList.add("dragging"),0);
    });
    //removing dragging class from item on dragend event
    item.addEventListener("dragend", () => item.classList.remove("dragging"));
})

const initSortableList = (e) => {
    const draggingItem = sortableList.querySelector(".dragging");
    // getting all items except currently dragging and making array of them
    const siblings = [...sortableList.querySelectorAll(".location-item:not(.dragging)")];

    // finding the sibling after which the dragging item should be placed
    let nextSibling = siblings.find(sibling => {
        return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
    });
    // console.log("nextSibling");
    
    // inserting the dragging item before the found sibling
    sortableList.insertBefore(draggingItem, nextSibling);
}

sortableList.addEventListener("dragover", initSortableList);
