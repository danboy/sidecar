var JS = {
  merge: function(obj1, obj2){
   for (var attrname in obj2) { 
     obj1[attrname] = obj2[attrname]; 
   }
   return obj1;
  }
, create: function(options, container){
    var attrs = this.merge({
      type    : 'div'
    }, options);
    var obj = document.createElement(attrs.type);
    obj.className = attrs.class;
    return obj;
  }
, addClass: function(object, className){
    if(!object.classList.contains(className)){
      object.className += ' '+className
    }
  }
, removeClass: function(object, className){
    regex = RegExp("(?:^|\\s)" + className + "(?!\\S)", "g");
    object.className = object.className.replace(regex , '' );
  }
}
