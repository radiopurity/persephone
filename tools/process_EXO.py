
# EXO Convesion Script
# Using specification v1.01
# J.C. Loach (2013)

# Textual replacements
remove = {r"\centering":"", r"newline":"", r"tabular":""};

# Main loop through data file
with open("exo_data.txt") as f_in:
  for line in f_in:
    for i, j in remove.iteritems():
      line = line.replace(i,j)
    line = line.split("&")
    line = [i.strip() for i in line] 
    with open("EXO_" + line[0].zfill(3) + "_v1.01.json", 'w') as f_out:    
      f_out.write("{\n")
      f_out.write("\n")
      f_out.write("  \"type\":                   \"measurement\",\n")
      f_out.write("\n")
      f_out.write("  \"grouping\":               \"EXO(2008)\",\n")
      f_out.write("\n")

      # Sample

      f_out.write("  \"sample\": {\n")
      f_out.write("    \"m_name\":                 \"" + line[1] + "\",\n")
      f_out.write("    \"m_description\":          \"" + line[1] + "\",\n")
      f_out.write("    \"m_id\":                   \"Table 3 Measurement " + line[0] + "\",\n")
      f_out.write("    \"m_source\":               \"\",\n")
      f_out.write("    \"m_owner\": {\n")
      f_out.write("      \"name\":                   \"\",\n")
      f_out.write("      \"contact\":                \"\"\n")
      f_out.write("    }\n")
      f_out.write("  },\n")
      f_out.write("\n")

      # Measurement
  
        # ...

      # Data source

        # ...

      f_out.write("}\n")


