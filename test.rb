#!/usr/bin/env ruby
require 'uri'

params = {
    :customer_id => "1100",
    :card_number => "4111 1111 1111 1111".gsub(/\s/, ''),
    :expiration_year => "2017",
    :expiration_month => "01",
    :cvv => "123"
}
# test POSTing card
cmd = "curl -X POST http://localhost:5000/card -d \"#{URI.encode_www_form(params)}\""
puts cmd
puts `#{cmd}`

