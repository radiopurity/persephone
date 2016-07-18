#!/usr/local/bin/python3
"""
Convert tabular text file in json files for upload.
"""

import json
import csv
from collections import OrderedDict

raw_data_file = '/Users/jloach/Dropbox/persephone/data/Majorana/example_raw_data.txt'
output_path = '/Users/jloach/Dropbox/persephone/data/Majorana/output/mj_'

raw_data = OrderedDict()
counter = 0
with open(raw_data_file, 'r') as f:
    reader = csv.reader(f, delimiter='&')
    for row in reader:
        raw_data[counter] = row
        counter += 1

for row in raw_data:
    
    # Data source
    data_source = {
        "input": {
            "notes": "",             
            "date": "2016-07-14", 
            "contact": "james.loach@gmail.com", 
            "name": "James Loach"
        }, 
        "reference": "N. Abgrall et al., Nucl. Instr. and Meth. A 828 (2016) (doi:10.1016/j.nima.2016.04.070)"
    }
    
    # Sample
    sample = {
        "owner": {
            "contact": "", 
            "name": ""
        }, 
        "source": "", 
        "name": raw_data[row][1].strip(), 
        "description": raw_data[row][1].strip(),         
        "id": raw_data[row][0].strip()
    }
    
    # Measurement

    k_result  = raw_data[row][3].strip()
    th_result = raw_data[row][4].strip()
    u_result  = raw_data[row][5].strip()
    
    k_type, u_type, th_type = "", "", ""
    
    if "+-" in k_result:
        k_type = "measurement"
    elif "<" in k_result:
        k_type = "limit"
    else:
        print("k ERROR", row)
        
    if "+-" in th_result:
        th_type = "measurement"
    elif "<" in th_result:
        th_type = "limit"
    else:
        print("th ERROR", row)
        
    if "+-" in u_result:
        u_type = "measurement"
    elif "<" in u_result:
        u_type = "limit"
    else:
        print("u ERROR", row)        

    if k_type == "measurement":
        k_result =  { "unit": "ppb", "type": k_type, 
                      "value": [k_result], "isotope": "K" } 
    elif k_type == "limit":
        k_result =  { "unit": "ppb", "type": k_type, 
                      "value": [k_result, 68], "isotope": "K" } 
        
    if th_type == "measurement":
        th_result =  { "unit": "ppt", "type": th_type, 
                      "value": [th_result], "isotope": "Th-232" } 
    elif th_type == "limit":
        th_result =  { "unit": "ppt", "type": th_type, 
                      "value": [th_result, 68], "isotope": "Th-232" } 
        
    if u_type == "measurement":
        u_result =  { "unit": "ppt", "type": u_type, 
                      "value": [u_result], "isotope": "U-238" } 
    elif u_type == "limit":
        u_result =  { "unit": "ppt", "type": u_type, 
                      "value": [u_result, 68], "isotope": "U-238" }         

    results = []
    if k_result != "": results.append(k_result)
    if th_result != "": results.append(th_result)
    if u_result != "": results.append(u_result)        
        
    measurement = {
        "practitioner": {
          "contact": "", 
          "name": ""
        }, 
        "description": "", 
        "technique": raw_data[row][2].strip(), 
        "results": results, 
        "requestor": {
          "contact": "", 
          "name": ""
        }, 
        "date": [], 
        "institution": ""
        }
        
    assay = {
        "type": "measurement", 
        "specification": "3.00", 
        "grouping": "Majorana (2016)",
        "sample": sample,
        "data_source": data_source,
        "measurement": measurement
    }
    
    json.dump(assay, open(output_path + str(row).zfill(3) + '.json', 'w'), 
              indent=2, ensure_ascii=False)


