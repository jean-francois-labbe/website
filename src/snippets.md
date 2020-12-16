---
layout: prose
---

# Useful snippets of code

## Rails

**Apply model validation on some context**

```ruby
# Model
class Ticket < ActiveRecord::Base
  belongs_to :user

  validate :user_cant_be_blacklisted, on: :confirmation

  def confirm
    update confirmed: true if confirmable?
  end

  def confirmable?
    valid? :confirmation
  end

  private
    def user_cant_be_blacklisted
      errors.add :user, "user is blacklisted" if user.blacklisted?
    end
end

ticket.confirmable?
ticket.save(context: :confirmation)
ticket.confirm
```

## Ruby

### Configuration settings

```ruby
module SomeGem
  class << self
    attr_accessor :configuration

    def configure
      self.configuration ||= Configuration.new
      yield(configuration)
    end
  end

  class Configuration
    attr_accessor :api_key, :app_name
  end
end

SomeGem.configure do |config|
  config.api_key = 'api_key'
  config.app_name = 'My App'
end

SomeGem.configuration.api_key # => 'api_key'
SomeGem.configuration.app_name # => 'My App'
```

### Parse command line options
```ruby
require 'optparse'

options = {}

parser = OptionParser.new do |parser|
  parser.on("-f", "--first-name FIRST_NAME", "Replacement for Chuck's first name")
  parser.on("-l", "--last-name LAST_NAME", "Replacement for Chuck's last name")
  parser.on("-r", "--random RANDOM_JOKES_COUNT", "Render n random jokes")

  parser.on("-h", "--help", "Prints this help") do
    puts parser
    exit
  end
end

parser.parse!(into: options)
```

### Great url query builder
```ruby
options = {}
base_url = "http://api.icndb.com/jokes/random"
base_url += "/#{options.fetch(:random)}" if options.key?(:random)
uri = URI(base_url)
query = {
  'firstName' => options[:'first-name'],
  'lastName' => options[:'last-name']
}.delete_if { |key, value| value.nil? }
uri.query = Rack::Utils.build_query(query) unless query.empty?

response = Net::HTTP.get_response(uri).body
```



## Debugging
```bash
strace -f -e %file bundle 2>&1 | grep -v -e /lib -e /usr | head
```

```bash
ltrace -e getenv ruby /usr/local/bin/bundle
```
