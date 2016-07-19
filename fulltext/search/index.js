function(doc) { 
  var ret = new Document();
  if (doc.grouping) {
    ret.add(doc.grouping);
    ret.add(doc.grouping, {"field":"grouping", "store":"yes"});
  };
  if (doc.sample) {
    ret.add(doc.sample.name);
    ret.add(doc.sample.description);
    ret.add(doc.sample.name, {"field":"name", "store":"yes"});
    ret.add(doc.sample.description, {"field":"description", "store":"yes"});
  };
  if (doc.measurement) {
    if (doc.measurement.results) {
      if (doc.measurement.results.length > 0) {
        for (var i=0; i<doc.measurement.results.length; i++) {
          var value = doc.measurement.results[i];
          var result1 = "", result2 = "";
          if (value.type == "measurement") {
            if (value.value.length == 1) {
              result1 = value.value[0];
            } else if (value.value.length == 2) { result1 = value.value[0];
               result2 = "(" + value.value[1] + ")";
            } else if (value.value.length == 3) {
               result1 = value.value[0];
               result2 = "(" + value.value[1] + "-" + value.value[2] + ")";
            }
          } else if (value.type == "limit") {
            if (value.value.length == 1) {
              result1 = value.value[0];
            } else if (value.value.length == 2) {
              result1 = value.value[0];
              result2 = "(" + value.value[1] + "%)";
            }
          } else if (value.type == "range") {
            if (value.value.length == 2) {
              result1 = value.value[0] + " - " + value.value[1];
            } else if (value.value.length == 3) {
              result1 = value.value[0] + " - " + value.value[1];
              result2 = "(" + value.value[2] + "%)";
            }
          }
          ret.add(value.isotope, {"field":"isotope", "store":"yes"});
          ret.add(value.unit, {"field":"unit", "store":"yes"});
          ret.add(value.type, {"field":"type", "store":"yes"});
          ret.add(result1, {"field":"result1", "store":"yes"});
          ret.add(result2, {"field":"result2", "store":"yes"});
        }
      }
    }
  }
  return ret;
}
