require 'net/http'
require 'json'

(0..303).each do |slot|
  url = "https://api.opensea.io/api/v1/asset/0x5138db27d140a3d44f23c549592322334c94f062/#{slot}?force_update=true"
  uri = URI(url)
  response = Net::HTTP.get(uri)
  json = JSON.parse(response)
  puts json
end

