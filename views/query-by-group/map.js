function (doc) {
	if(doc.type == "measurement" && doc.grouping && doc.sample.name){
		var all_isotope = [], all_unit = [], all_type = [], all_result1 = [], all_result2 = [];
		if(doc.measurement.results.length>0){
    	    for(var i=0;i<doc.measurement.results.length;i++){
    	        var value = doc.measurement.results[i];
    	        var result1="",result2="";
    	        if (value.type == "measurement"){
    	            if (value.value.length ==1){
    	                result1=value.value[0];
    	            }
    	            else if (value.value.length == 2){
    	                result1=value.value[0];
    	                result2="("+value.value[1]+")";
    	            }
    	            else if (value.value.length == 3){
    	                result1=value.value[0];
    	                result2="(+"+value.value[1]+"-"+value.value[2]+")";
    	            }
    	        }
    	        else if (value.type == "limit"){
    	            if (value.value.length==1){
    	                result1=value.value[0];
    	            }
    	            else if(value.value.length==2){
    	                result1=value.value[0];
    	                result2="("+value.value[1]+"%)";
    	            }
    	        }
    	        else if (value.type == "range"){
    	            if (value.value.length==2){
    	                result1=value.value[0]+" - "+value.value[1];
    	            }
    	            else if (value.value.length==3){
    	                result1=value.value[0]+" - "+value.value[1];
    	                result2="("+value.value[2]+"%)";
    	            }
    	        }
    	        all_isotope.push(value.isotope);
    	        all_unit.push(value.unit);
    	        all_type.push(value.type);
    	        all_result1.push(result1);
    	        all_result2.push(result2);
    	    }
   		}
		res = {
			id: doc._id,
			type: doc.type,
			name: doc.sample.name,
			description: doc.sample.description,
			isotope: all_isotope,
			unit: all_unit,
			type: all_type,
			result1: all_result1,
			result2: all_result2,
			grouping: doc.grouping
		};
		emit([doc.grouping,doc.sample.name],res);
	}
};