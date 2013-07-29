/*
map.js
============
--------------------------------------------------------------------------
Name:           map.js
Purpose:        Sort the result by the thorium.

Description:
	Unit:
		Category One
		   ppm (parts per million)
		   ppb (parts per billion)
		   ppt (parts per trillion)
		   1 ppm = 1000 ppb
		   1 ppb = 1000 ppt
		Category Two
		   Bq/kg (becquerels per kg)
		   mBq/kg (milli becquerels per kg)
		   muBq/kg = uBq/kg (micro becquerels per kg) (two different shorthands for the greek letter)
		   1 Bq/kg = 1000 mBq/kg
		   1 mBq/kg = 1000 uBq/kg = 1000 muBq/kr
		Category Three
		   Anything else

Author:         Zheng Li
Email:          Ronnie.alonso@gmail.com

Created:        14 July 2013
Copyright:      (c) Zheng Li 2013
--------------------------------------------------------------------------
*/
function (doc) {
	var Th_priority = ["Th", "Th-232", "232-Th", "Th232", "232Th"];
	var pri_th=9999;
	var th={"unit":"-","value":["-"],"isotope":"-","type":"measurement"}
	var unit = {"ppt":{"category":1 , "coefficient":1} , 
				"ppb":{"category":1 , "coefficient":1000} ,
				"ppm":{"category":1 , "coefficient":1000000},
				"nBq/kg":{"category":2 , "coefficient":1},
				"uBq/kg":{"category":2 , "coefficient":1000},
				"muBq/kg":{"category":2 , "coefficient":1000},
				"mBq/kg":{"category":2 , "coefficient":1000000},
				"Bq/kg":{"category":2 , "coefficient":1000000000},
		}

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
		tvalue= parseFloat(th.value[0]);
		// Convert the unit
		if(unit.hasOwnProperty(th.unit)){
			var coefficient = unit[th.unit].coefficient
			var category = unit[th.unit].category
			emit([category , tvalue * coefficient],doc);
		}
		else{
			if(th.unit != "-"){

				emit([3,tvalue],doc);
			}
			else{
				emit([4,tvalue],doc);
			}
		}
/*		if(th.unit=="ppt"){
			emit([1,tvalue],doc);
		}else
		if(th.unit=="ppb"){
			emit([1,tvalue*1000],doc);
		}else
		if(th.unit=="ppm"){
			emit([1,tvalue*1000000],doc);
		}else
		if(th.unit=="nBq/kg"){
			emit([2,tvalue],doc);
		}else
		if(th.unit=="uBq/kg"){
			emit([2,tvalue*1000],doc);
		}else
		if(th.unit=="mBq/kg"){
			emit([2,tvalue*1000000],doc);
		}else{
			emit([3,tvalue],doc);
		}*/
	}
};