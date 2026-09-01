# Teacher-Message Delivery

States distinguish Draft, Ready/Reviewed, Copied, Opened in Email, Send Requested, Sent Confirmed, Failed, Delivery Unknown, Waiting, Responded and Reviewed. Every send requires final recipient/subject/summary/copy/attachment/personal warning confirmation and idempotency. Provider acceptance is not receipt/read. Offline supports Draft/Copy only and never queues a reconnect send. This static build refuses real sending.
