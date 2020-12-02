---
layout: post
published: true
title:  How to unit test YAML file
head_title: How to unit test YAML file [Tutorial]
date: 2018-02-13T20:00:00+01:00
description: Unit test huge YAML file for your own safety.
summary: Imagine you have a huge YAML file, say 800 lines of docker-compose.yml for example. Then you want to be sure that all your services run with memory limit and that something will complain if a new one doesn't have them. I wanted to unit test a YAML file.
last_modified_at: 2019-08-21T20:00:00+01:00
image: /images/yaml-test/unittest.jpg
main_image_description: Unit testing
keywords: Ruby, development, testing, best practicies, docker, yaml, save money, startup
---

Imagine you have a huge YAML file, say 800 lines of docker-compose.yml for example.
Then you want to be sure that all your services run with memory limit and that something will complain if a new one doesn't have them.
I wanted to unit test a YAML file.
The famous `docker-compose.yml` which in my company was maintained by multiple developers.

I wanted to enforce configuration coherence between deployed services such as:
* logging
* memory restriction
* hostname
* mandatory labels

Just creating documentation describing what to add put in a docker-compose would be used once or twice then forgotten.
Using a developer tool to ensure configuration coherence is way better: Unit testing

I've decided to use [minitest](https://github.com/seattlerb/minitest#specs) to perform those tests as it enforces a style that is easy to read even for non-developers.

# YAML

Here is the `docker-compose.yml` we will use, it's Graylog docker-compose:

```YAML
version: '2'
services:
  mongodb:
    image: mongo:3
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:5.6.3
    environment:
      - http.host=0.0.0.0
      - transport.host=localhost
      - network.host=0.0.0.0
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ulimits:
      memlock:
        soft: -1
        hard: -1
    mem_limit: 1g
  graylog:
    image: graylog/graylog:2.4.0-1
    environment:
      GRAYLOG_PASSWORD_SECRET: somepasswordpepper
      GRAYLOG_ROOT_PASSWORD_SHA2: 8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918
      GRAYLOG_WEB_ENDPOINT_URI: http://127.0.0.1:9000/api
    links:
      - mongodb:mongo
      - elasticsearch
    depends_on:
      - mongodb
      - elasticsearch
    ports:
      - 9000:9000
      - 514:514
      - 514:514/udp
      - 12201:12201
      - 12201:12201/udp
```
# Unit tests

## Load YAML file

First, we need to be able to load the YAML file

```ruby
docker_compose = YAML.load_file('docker-compose.yml')

=> {"version"=>"2",
 "services"=>
  {"mongodb"=>{"image"=>"mongo:3"},
   "elasticsearch"=>
    {"image"=>"docker.elastic.co/elasticsearch/elasticsearch:5.6.3",
    ...
```

This allows us to do:

```ruby
docker_compose['services']['mongodb']

=> {"image"=>"mongo:3"}
```

ps: if you have issues loading the YAML file try to use [YAML.safe_load()](http://ruby-doc.org/stdlib-2.5.0/libdoc/psych/rdoc/Psych.html#method-c-safe_load)

## Setting minitest

docker_compose_test.rb
```ruby
require 'YAML'
require 'minitest/autorun'

describe 'graylog-docker-compose' do

  describe 'compulsory labels' do
    it 'all containers must have memory limit' do
      docker_compose['services'].each do |service_name, service_details| 
        refute_nil service_details.dig('mem_limit'), "#{service_name} service is missing 'mem_limit'"
      end
    end
  end

  describe 'graylog container' do
    it 'must declare GRAYLOG_WEB_ENDPOINT_URI env variable' do
      assert_equal 'http://127.0.0.1:9000/api' ,docker_compose['services']['graylog']['environment']['GRAYLOG_WEB_ENDPOINT_URI']
    end
  end

  def docker_compose
    YAML.load_file('docker-compose.yml')
  end
end
```

## Execute

```ruby
ruby docker_compose_test.rb

Run options: --seed 42179

# Running:

F

Failure:
graylog-docker-compose::compulsory labels#test_0001_all containers must have memory limit [test.rb:9]:
mongodb service is missing 'mem_limit'.
Expected nil to not be nil.


bin/rails test test.rb:7

.

Finished in 0.003673s, 544.5684 runs/s, 544.5684 assertions/s.
2 runs, 2 assertions, 1 failures, 0 errors, 0 skips
```

## Update docker-compose

```YAML
version: '2'
services:
  mongodb:
    mem_limit: 1g
    image: mongo:3
  elasticsearch:
    mem_limit: 1g
    image: docker.elastic.co/elasticsearch/elasticsearch:5.6.3
    environment:
      - http.host=0.0.0.0
      - transport.host=localhost
      - network.host=0.0.0.0
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ulimits:
      memlock:
        soft: -1
        hard: -1
    mem_limit: 1g
  graylog:
    mem_limit: 1g
    image: graylog/graylog:2.4.0-1
    environment:
      GRAYLOG_PASSWORD_SECRET: somepasswordpepper
      GRAYLOG_ROOT_PASSWORD_SHA2: 8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918
      GRAYLOG_WEB_ENDPOINT_URI: http://127.0.0.1:9000/api
    links:
      - mongodb:mongo
      - elasticsearch
    depends_on:
      - mongodb
      - elasticsearch
    ports:
      - 9000:9000
      - 514:514
      - 514:514/udp
      - 12201:12201
      - 12201:12201/udp
```

## Check it's ok

```ruby
Run options: --seed 8091

# Running:

..

Finished in 0.003307s, 604.7735 runs/s, 1209.5471 assertions/s.
2 runs, 4 assertions, 0 failures, 0 errors, 0 skips
```

## Conclusion

It's pretty easy to setup unit tests on a YAML file and executes them on CI
