/*== adds close button to all locations ==*/
var hamlist = document.getElementsByClassName("hamburger");
for (var i = 0; i < hamlist.length; i++) {
  var but = document.createElement("button");
  var txt = document.createTextNode("\u00D7");
  but.className = "close-loc";
  but.appendChild(txt);
  hamlist[i].appendChild(but);
}

// Click on a close button to hide the location item
var closeloc = document.getElementsByClassName("close-loc");
for (var i = 0; i < closeloc.length; i++) {
  closeloc[i].onclick = function() {
    var div = this.parentElement;
    var sdiv = div.parentElement;
    sdiv.style.display = "none";
  }
  node = document.getElementsByClassName("location-item");
}

var add = document.getElementsByClassName("add-loc");
add[0].onclick = function() {
  var container = document.getElementsByClassName("location-container")
  var node = document.getElementsByClassName("location-item");
  var clone = node[0].cloneNode(true);
  clone.style.display = "flex"
  var child = clone.getElementsByClassName("loc-title");
  var locItems = document.getElementsByClassName("location-item");
  child[0].innerHTML = "Location Title " + (locItems.length + 1);
  container[0].appendChild(clone);
  for (var i = 0; i < closeloc.length; i++) {
    closeloc[i].onclick = function() {
      var div = this.parentElement;
      var sdiv = div.parentElement;
      sdiv.style.display = "none";
    }
  }
  (()=> {enableDragSort('location-container')})();
}

/*== Allows drag and drop to arrange order of locations ==*/
function enableDragSort(listClass) {
  const sortableLists = document.getElementsByClassName(listClass);
  Array.prototype.map.call(sortableLists, (list) => {enableDragList(list)});
}

function enableDragList(list) {
  Array.prototype.map.call(list.children, (item) => {enableDragItem(item)});
}

function enableDragItem(item) {
  item.setAttribute('draggable', true)
  item.ondrag = handleDrag;
  item.ondragend = handleDrop;
}

function handleDrag(item) {
  const selectedItem = item.target,
        list = selectedItem.parentNode,
        x = event.clientX,
        y = event.clientY;
  
  selectedItem.classList.add('drag-sort-active');
  let swapItem = document.elementFromPoint(x, y) === null ? selectedItem : document.elementFromPoint(x, y);
  
  if (list === swapItem.parentNode) {
    swapItem = swapItem !== selectedItem.nextSibling ? swapItem : swapItem.nextSibling;
    list.insertBefore(selectedItem, swapItem);
  }
}

function handleDrop(item) {
  item.target.classList.remove('drag-sort-active');
}

(()=> {enableDragSort('location-container')})();

// This is the old Drag and drop list function, didnt work when you add a new item

// const sortableList = document.querySelector(".location-container");
// var items = document.querySelectorAll(".location-item");

// items.forEach(item => {
//     item.addEventListener("dragstart", () => {
//         //adding dragging class to item after a delay
//         setTimeout(() => item.classList.add("dragging"),0);
//     });
//     //removing dragging class from item on dragend event
//     item.addEventListener("dragend", () => item.classList.remove("dragging"));
// })

// const initSortableList = (e) => {
//     const draggingItem = sortableList.querySelector(".dragging");
//     // getting all items except currently dragging and making array of them
//     const siblings = [...sortableList.querySelectorAll(".location-item:not(.dragging)")];

//     // finding the sibling after which the dragging item should be placed
//     let nextSibling = siblings.find(sibling => {
//         return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
//     });
//     // console.log("nextSibling");
    
//     // inserting the dragging item before the found sibling
//     sortableList.insertBefore(draggingItem, nextSibling);
// }

// sortableList.addEventListener("dragover", initSortableList);
