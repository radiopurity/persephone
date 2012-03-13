CLOSED_IMAGE ='images/plus.png';
OPEN_IMAGE   ='images/minus.png';

// ____________________________________________________________________________________
function makeCollapsible(listElement){
   
   // make a list have collapsible sublists in listElement
      
   // removed list item bullets and the space they occupy
   listElement.style.listStyle='none';
   listElement.style.marginLeft='0';
   listElement.style.paddingLeft='0';
   
   // loop over all child elements of the list
   var child=listElement.firstChild;
   
   while ( child != null ) {
      
      // only process li elements (and not text elements)
      if ( child.nodeType == 1 ){
         
         // build a list of child ol and ul elements and hide them
         var list = new Array();
         var grandchild = child.firstChild;
         while ( grandchild != null ) {
            if ( grandchild.tagName == 'OL' || grandchild.tagName == 'UL' ) {
               grandchild.style.display = 'none';
               list.push(grandchild);
            }
            grandchild = grandchild.nextSibling;
         }
         
         // add toggle buttons
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
   
   // function that toggles the sublist display
   
   // toggleElement  - the element representing the toggle gadget
   // sublistElement - an array of elements representing the sublists that should
   //                  be opened or closed when the toggle gadget is clicked
   
   return function() {
      
      // toggle status of toggle gadget
      if ( toggleElement.getAttribute('class') == 'collapsibleClosed' ) {
         
         toggleElement.setAttribute('class','collapsibleOpen');
         toggleElement.setAttribute('src',OPEN_IMAGE);
         
      } else {
         
         toggleElement.setAttribute('class','collapsibleClosed');
         toggleElement.setAttribute('src',CLOSED_IMAGE);
         
      }
      
      // toggle display of sublists
      for ( var i = 0 ; i < sublistElements.length ; i++ ) {
         
         sublistElements[i].style.display=
         (sublistElements[i].style.display=='block')?'none':'block';
         
      }
      
   }
   
}