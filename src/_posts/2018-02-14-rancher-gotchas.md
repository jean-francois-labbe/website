---
layout: post
published: true
title:  "Rancher gotchas"
date: 2018-02-14T20:00:00+01:00
summary: I've been using Rancher for one year now with Cattle orchestrator. From ci to review env to production, I run everything with Rancher. It provides great value and is stable. Though we experienced some issues that I'd like to share here.
image: /images/rancher.jpg
main_image_description: Traps
---

I've been using [Rancher](https://rancher.com) for one year now with Cattle orchestrator.
From ci to review env to production, I run everything with Rancher.
It provides great value and is stable.
Though we experienced some issues that I'd like to share here.

# Gotchas

## Containers orchestration

It doesn't enforce best practices such as applying constraints on containers. Why is it important? well what if you had a server with 4G of ram, then you deploy multiple containers on this server. 

Everything looks fine at first until one container start consuming more and more
memory until the host has no more memory available. This is the beginning of a bad moment.

The host will then send kill signals to your
docker containers, eventually killing IPSec containers or rancher-agent container. So, in the end, you will see a `Disconnected` host. Most of
the time you will need to manually evacuate the host.

Beware the cascade effect.

Be evacuating containers from the disconnected server they will be scheduled on some other hosts that can experience the same thing as the
Disconnected server.

## Rancher database pressure

After the evacuation of a host or updating some stack, you can find some host in the `Reconnecting` state. This is bad.

Your servers are known by Rancher but Rancher cannot display their state, then you'll see your stacks and containers becoming Unhealthy.

But these are false status. Check your services before taking actions in Rancher usually they are in Good state.

The `Reconnecting` state appeared on our Rancher and was due to too much pressure on the Rancher database. Someone had a really hard night
try to bring everything back up to only see all new hosts and stacks go to `Reconnecting` state.

If your Rancher database is 100% CPU then Rancher will display wrong stack/host/services status.

## Containers logs

By default there are no logging limits on containers, what this means is that you can see the container log history, and all the logs are
stored in one file on the server.

What can go wrong is that one container could generate a lot of logs until the disk is full.

So always apply [logging limits](https://docs.docker.com/config/containers/logging/json-file/#usage) such as max-size, max-file on the container

Always use a service to aggregate logs, such as [Graylog](https://www.graylog.org)

# Conclusion

Monitor your Rancher servers and Rancher Database.

Apply memory restriction

Apply logging limits
