CLOSED_IMAGE ='images/plus.png';
OPEN_IMAGE   ='images/minus.png';

// Note: The origin of this code is unknown.

// ____________________________________________________________________________________
function makeCollapsible(listElement){
   
  // Make a list have collapsible sublists in listElement
      
  // Removed list item bullets and the space they occupy
  listElement.style.listStyle='none';
  listElement.style.marginLeft='0';
  listElement.style.paddingLeft='0';
   
  // Loop over all child elements of the list
  var child=listElement.firstChild;
   
  while ( child != null ) {
      
    // Only process li elements (and not text elements)
    if ( child.nodeType == 1 ){
         
      // Build a list of child ol and ul elements and hide them
      var list = new Array();
      var grandchild = child.firstChild;
      while ( grandchild != null ) {
        if ( grandchild.tagName == 'OL' || grandchild.tagName == 'UL' ) {
          grandchild.style.display = 'none';
          list.push(grandchild);
        }
        grandchild = grandchild.nextSibling;
      }
         
      // dd toggle buttons
      var node = document.createElement('img');
      node.setAttribute('src', CLOSED_IMAGE);
      node.setAttribute('class', 'collapsibleClosed');
      node.onclick = createToggleFunction(node, list);
      child.insertBefore(node, child.firstChild);
         
    }
      
    child = child.nextSibling;
      
  }
   
}

// ____________________________________________________________________________________ 
function createToggleFunction(toggleElement, sublistElements) {
   
  // Function that toggles the sublist display
   
  // toggleElement  - the element representing the toggle gadget
  // sublistElement - an array of elements representing the sublists that should
  //                  be opened or closed when the toggle gadget is clicked
   
  return function() {
      
    // Toggle status of toggle gadget
    if ( toggleElement.getAttribute('class') == 'collapsibleClosed' ) {
         
      toggleElement.setAttribute('class','collapsibleOpen');
      toggleElement.setAttribute('src',OPEN_IMAGE);
         
    } else {
         
      toggleElement.setAttribute('class','collapsibleClosed');
      toggleElement.setAttribute('src',CLOSED_IMAGE);
         
    }
      
    // Toggle display of sublists
    for ( var i = 0 ; i < sublistElements.length ; i++ ) {
         
      sublistElements[i].style.display=
      (sublistElements[i].style.display=='block')?'none':'block';
         
    }
      
  }
   
}