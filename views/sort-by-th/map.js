function (doc) {
	var Th_priority = ["Th", "Th-232", "232-Th", "Th232", "232Th"];
	var pri_th=9999;
	var th={"unit":"-","value":["-"],"isotope":"-","type":"measurement"}

	// go through all the results
	if(doc.type == "measurement"){

		for(var k in doc.measurement.results){
			var item = doc.measurement.results[k];

			// select Th
			for (var i = 0; i < Th_priority.length; i++) {
				if (item.isotope == Th_priority[i] && i < pri_th){
					th = item;
					pri_th = i;
				}
			};
		}

		 // Convert the unit
		if(th.unit=="ppt"){
			emit([1,th.value[0]],doc);
		}else
		if(th.unit=="ppb"){
			emit([1,th.value[0]*1000],doc);
		}else
		if(th.unit=="ppm"){
			emit([1,th.value[0]*1000000],doc);
		}else
		if(th.unit=="nBq/kg"){
			emit([2,th.value[0]],doc);
		}else
		if(th.unit=="uBq/kg"){
			emit([2,th.value[0]*1000],doc);
		}else
		if(th.unit=="mBq/kg"){
			emit([2,th.value[0]*1000000],doc);
		}else{
			emit([3,th.value[0]],doc);
		}
	}
};