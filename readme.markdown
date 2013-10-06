# nodeification

A tiny node api useful for broadcasting short messages to your team.

Currently supports Pushover, with email coming shortly.

## Overview

Post JSON to `/notifications` like:

```json
{
  "namespace": "coolapp",
  "event": "account.signup",
  "account_id": 42,
  "plan_name": "Starter"
}
```

Users of the system subscribed to the given namespace and event
will receive a short message on a media of their choice (currently
Pushover).

## Configuring message formatting

For a namespace `coolapp` create a CouchDB document like this:

```json
{
   "_id": "coolapp",
   "account.canceled": "account canceled, boo =(, id: {{id}}, plan: {{plan}}",
   "account.signup": "account signed up!  email: {{email}}, plan: {{plan}}"
}
```

The templates support familiar Mustache tags which are populate from the data.  If
no template is found, the system will ignore the message and skip broadcasting.

## Configuring user subscriptions

To keep things simple, users and their subscriptions are kept in single
user documents with the subscriptions embedded.  This is assuming the system
will not involve heavy contention on writing user documents, and instead
is read heavy looking up subscription info.  It also assumes users will not
have thousands of subscriptions.

```json
{
   "type": "user",
   "subscriptions": {
       "coolapp": {
           "account.canceled": [
               "pushover"
           ],
           "account.signup": [
               "pushover"
           ]
       },
       "awesomeapp": {
           "account.signup": [
               "email"
           ]
       }
   },
   "name": "John Doe",
   "contact": {
       "pushover": "LM1g2OeZsaI7gCZjaHDBx0u1l91KEA",
       "email": "jdoe@example.com"
   }
}
```

In the above example, the user John Doe is configured to receive
pushover notifications regarding coolapp, for account cancellation
and signup events.  However, for awesomeapp, John will only receive
email notifications for account.signup events.

## Notes

Super beta, no auth yet, api notification structure will likely get
nested.

## Todo

Get the CouchDB design docs into repo
