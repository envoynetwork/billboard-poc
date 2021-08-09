require 'json'

def getSlotNames
  slotNames = []
  ('A'..'Z').each do |row|
    (1..40).each do |col|
      slotNames.push("#{row}#{col.to_s.rjust(2, "0")}")
    end
  end
  slotNames
end

def parseJSON(slot)
  {
    "name": "Slot #{getSlotNames[slot]}",
    "description": "This NFT gives you access to slot #{getSlotNames[slot]} on Decentraboard",
    "image": "https://www.decentraboard.com/slots/#{getSlotNames[slot]}.jpg",
    "external_link": "https://www.decentraboard.com/"
  }.to_json
end


(0..1039).each do |slot|
  json_file = File.new("0-#{slot}.json", "w")
  json_file.puts(parseJSON(slot))
  json_file.close
end