---
disqus: http://sturdynut.com/blog/couchdb-replication-tips.html
layout: post
background: "17.jpg"
title: "CouchDB Replication Tips"
author: Matti Salokangas
comments: true
tags:
  - couchdb
  - replication
---

I recently embarked upon a journey where I needed to build a user interface in React to manage replication for groups of devices in an environment where internet connectivity and DNS are not guaranteed.  This posed unique challenges, such as...

- How to construct connection strings that used hostnames vs IP addresses, because IP addresses change.
- How to ensure when a device leaves the network and comes back that there is no data loss.
- How to ensure we are only replicating to who we should be, even if a device goes offline and comes back online and another device left while it was offline.

Coming at it from having no experience with CouchDB, I made some mistakes and learned some things.  I'd like to share these with you in hopes that it makes your life easier.

It took a lot of work, but once things were working it was pretty magical. 🧙‍♂️

_NOTE: This is not a complete intro to CouchDB, some level of experience with CouchDB is recommended, but not necessary._

## What is it?

### CouchDB

In the simplest sense, CouchDB is a NoSQL database that stores your data as JSON objects. It also provides an [API](http://docs.couchdb.org/en/stable/api/) that you can use via HTTP and has data replication out of the box.

### Replication

Replication is the feature that makes CouchDB stand out in the crowd of NoSQL databases.  It uses HTTP to synchronize your JSON documents between 2 peers using the CouchDB API.  CouchDB will also automagically resolve conflicts for you using a nifty algorithm (more on this later).

## Configuration

Here are some settings you will want to consider when setting up replication.

- `bind_address` should be set to "0.0.0.0" when replicating
- `enable_cors` should be "true" when replicating
- `retries_per_request` - How many times to retry (default: 5)
- `connection_timeout` - How long to wait (default: 30000)
- `http_connections` - Max number of connections per replication (default: 20)

## Conflicts

### Choosing winners and preventing data loss

In the case of a conflict, you may wonder who would win and if data is lost.  Well, CouchDB actually will keep a record of both documents so data will never be lost.

_But, how is the winner decided?_

CouchDB uses a deterministic algorithm that ensures it always picks the same winner.

**The Algorithm**

"the revision with the longest revision history list becomes the winning revision". [ref](http://guide.couchdb.org/draft/conflicts.html)

You can read more about the algorithm [here](http://guide.couchdb.org/draft/conflicts.html).


### How to View Conflicts

For a specific document:

`/database_name/the_id?conflicts=true`

For an existing view:

`/database_name/_design/documents_name/_view/view_name?conflicts=true&include_docs=true`

Create a view that emits conflicts:

```
function(doc) {
  if(doc._conflicts) {
    emit(doc._conflicts, null);
  }
}
```

### How to Resolve Conflicts

Using the CouchDB dashboard...

- Find the document with conflicts
- Click into the document
- There should be a "Conflicts (_n_)" button where _n_ is the number of conflicts.
- Click the "Conflicts" button
- Select your winner

Here's a nice video demonstrating this: [View video](https://www.youtube.com/watch?v=3G8d7PzMVsk)

Programmatically...

There is no built-in way to programmatically resolve conflicts in CouchDB's API.

However, Here is a simplified way to approach solving for this:

1) Create a view that emits conflicts for your database (see example above) or listen for changes. [more info](https://docs.couchdb.org/en/3.0.0/api/database/changes.html)

2) If there are conflicts...
  - Determine the winning revision using your own algorithm
  - Delete other revisions, leaving your own selected winner

### How to Avoid Conflicts

Do not use arrays as children when possible.  It is better to have a separate document to store each child and use an ID to reference the parent.

Given the examples below, if the *BAD* example was to go offline and a new friend was added, upon going back online it could be lost.

_Examples:_

*BAD*

```
{
  id: 1,
  name: "Matti",
  friends: [
    {
      name: "Lindsey"
    },
    {
      name: "Ryan"
    }
  ],
  type: "person"
}
```

*GOOD*

```
{
  id: 1,
  name: "Matti",
  type: "person"
}

{
  id: 2,
  parentId: 1,
  name: "Lindsey",
  type: "friend"
}

{
  id: 3,
  parentId: 1,
  name: "Ryan",
  type: "friend"
}
```

In general, you should strive to use conflict-free replicated data types.

A CRDT "is a data structure which can be replicated across multiple computers in a network, where the replicas can be updated independently and concurrently without coordination between the replicas, and where it is always mathematically possible to resolve inconsistencies which might result" [ref](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type)

### How to Filter what is Replicated

By default everything will be replicated however, what happens when you do not want to replicate everything?

### Filter Functions

Filter functions are a built-in mechanism within CouchDB that allow you to filter your data using a function.

_Tip:_ You return `true` from your filter function to keep documents

_NOTE: CouchDB uses an old JS engine so ES6/2015 JS will not work_

*Example*

The example below will filter out the color "red".

```
{
  _id: `_design/document_name`,
  filters: {
    filter_name: function(doc) {
      return doc.color !== "red";
    },
  },
}
```

You can read more about Filter functions [here](https://docs.couchdb.org/en/stable/ddocs/ddocs.html#filter-functions)

Once you have a Filter function created, all you need to do is add it to the options when you setup replication, like so:

_Example POST to `/_replicator`_
```
{
    "_id": "my_rep",
    "source": "http://myserver.com/foo",
    "target":  "http://user:pass@localhost:5984/bar",
    "create_target":  true,
    "continuous": true,
    "filter": "document_name/filter_name"
}
```

## Keeping _replicators Clean

To see what is replicating you can look at the `_scheduler/docs` path.

By taking this list and cross-referencing it with what should be replicating you can determine what _replicator records to clean up.

## Local Hostname Resolution

A major hiccup when using hostnames is that they can take a long time for it to propagate the network and even worse what if there is no DNS server?

One solution is to use [Avahi](https://avahi.org/).  Avahi allows for service discovery on local networks via Multicast DNS.  This allowed devices to be discoverable when using `*.local` hostname.

For a Javascript/Node based solution, you can try [discovery-swarm](https://github.com/mafintosh/discovery-swarm)

## Summary

CouchDB replication is magical.  To keep it magical, it is best to design your documents to be replication-friendly and also consider adjusting some of the default settings.

I hope this filled in some gaps and provided useful tips to make your next CouchDB adventure a bit easier, so you can "relax". ;)

## Links

- [CouchDB Docs](https://docs.couchdb.org/en/stable/)
- [CouchDB Best Practices](https://docs.couchdb.org/en/3.0.0/best-practices/index.html)
- [CouchDB Replication Docs](https://docs.couchdb.org/en/3.0.0/replication/index.html)
- [Conflict-Free Replicated Data Types](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type)
- [CouchDB-Nano](https://github.com/apache/couchdb-nano) - Node library for CouchDB
