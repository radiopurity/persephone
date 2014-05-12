function(doc){
    index(\"default\", doc.sample.name);
    if(doc.sample.name){
        index(\"name\",doc.sample.name,{\"store\":\"yes\"});
    }
    if(doc.grouping){
        index(\"grouping\",doc.grouping,{\"store\":\"yes\"});
        index(\"default\",doc.grouping,{\"store\":\"yes\"});
    }
    if(doc.sample.description){
        index(\"description\",doc.sample.description,{\"store\":\"yes\"});
        index(\"default\",doc.sample.description,{\"store\":\"yes\"});
    }
    if(doc.measurement.results.length>0){
        for(var i=0;i<doc.measurement.results.length;i++){
            var value = doc.measurement.results[i];
            var result1=\"\",result2=\"\";
            if (value.type == \"measurement\"){
                if (value.value.length ==1){
                    result1=value.value[0];
                }
                else if (value.value.length == 2){
                    result1=value.value[0];
                    result2=\"(\"+value.value[1]+\")\";
                }
                else if (value.value.length == 3){
                    result1=value.value[0];
                    result2=\"(+\"+value.value[1]+\"-\"+value.value[2]+\")\";
                }
            }
            else if (value.type == \"limit\"){
                if (value.value.length==1){
                    result1=value.value[0];
                }
                else if(value.value.length==2){
                    result1=value.value[0];
                    result2=\"(\"+value.value[1]+\"%)\";
                }
            }
            else if (value.type == \"range\"){
                if (value.value.length==2){
                    result1=value.value[0]+\" - \"+value.value[1];
                }
                else if (value.value.length==3){
                    result1=value.value[0]+\" - \"+value.value[1];
                    result2=\"(\"+value.value[2]+\"%)\";
                }
            }
            index(\"isotope\",value.isotope,{\"store\":\"yes\"});
            index(\"unit\", value.unit,{\"store\":\"yes\"});
            index(\"type\", value.type,{\"store\":\"yes\"});
            index(\"result1\",result1,{\"store\":\"yes\"});
            index(\"result2\",result2,{\"store\":\"yes\"});
        }
    }
}
