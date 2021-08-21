require 'json'

#def getSlotNames
#  slotNames = []
#  ('A'..'Z').each do |row|
#    (1..40).each do |col|
#      slotNames.push("#{row}#{col.to_s.rjust(2, "0")}")
#    end
#  end
#  slotNames
#end

def parseJSON(slot)
  slotName = (slot+1).to_s.rjust(3, "0")
  {
    "name": "Slot #{slotName}",
    "description": "This NFT gives you access to slot #{slotName} on Decentraboard",
    "image": "https://www.decentraboard.com/slots/#{slotName}.jpg",
    "external_link": "https://www.decentraboard.com/"
  }.to_json
end


(0..441).each do |slot|
  json_file = File.new("0-#{slot}.json", "w")
  json_file.puts(parseJSON(slot))
  json_file.close
end