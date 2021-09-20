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
  slotTier = getTier(slot)
  slotName = (slot+1).to_s.rjust(3, "0")
  {
    "name": "Slot #{slotName} (#{slotTier})",
    "description": "This NFT gives you access to slot #{slotName} on Decentraboard in the #{slotTier} tier.",
    "image": "https://decentraboard.com/slots/#{slotName}.jpg?v=2",
    "external_link": "https://www.decentraboard.com/"
  }.to_json
end

def getTier(slot)

  if slot < 10
    "Diamond"
  elsif slot < 14
    "Moon"
  elsif slot < 54
    "Gold"
  elsif slot < 64
    "Platinum"
  elsif slot < 104
    "Silver"
  else
    "Bronze"
  end

end


(0..303).each do |slot|
  json_file = File.new("0-#{slot}.json", "w")
  json_file.puts(parseJSON(slot))
  json_file.close
end