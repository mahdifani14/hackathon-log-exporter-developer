# hackathon-log-exporter-developer

The Collaborne application logs all actions taken by its users. We use this data
to optimize the user experience. For that, our Data Science loads the
logs into [AWS Redshift](https://aws.amazon.com/redshift/), a hosted data warehouse system.

During the hackathon, you will explore how to extract data from these logs and prepare them for a load to Redshift.

You can either use Java or Node for the hackathon, depending on your personal preference. The hackathon should take ca. 1.5h to complete (excl. Q&A session).

## Preparations

Please execute the following steps to prepare your development environment
(example commands are for macOS/Linux).

### Shared

1. Unpack the ZIP file
   ```sh
   $ unzip hackathon-log-exporter-developer.zip
   ```

### Java-only

1. Install [Java](http://www.oracle.com/technetwork/java/javase/downloads/index.html) and [Maven](https://maven.apache.org/download.cgi)

2. Build and run the application
   ```sh
   $ cd hackathon-log-exporter-developer/java/
   $ mvn clean install
   $ java -cp target/classes/ com.collaborne.hackathon.exporter.log.App
   ```

### Node-only

1. Install [NodeJS and npm](https://nodejs.org/en/download/)

2. Run the application
   ```sh
   $ cd hackathon-log-exporter-developer/node/
   $ npm start
   ```

You see in your console a couple of sample log entries? Congratulations! You are ready to go. Good luck!

## Background

One of Collaborne's log files captures all changes sent to the user database.
Each log entry contains a time stamp and then further information as JSON.

The following log entry represents when Joe's account was created:
```
2017-03-13 02:45:58,660 {"date":"2017-03-13T10:45:58.660+0000","type":"User","op":"CREATE","params":{"obj":{"id":"bc68f233-09bd-4e51-3257-76bb1ec8c854","emails":["joe@collaborne.com"],"title":"Junior Coder","collaborne":{"createdBy":"admin"}}}}
```

This log entry shows when Joe changed his email address:
```
2017-03-13 09:45:11,962 {"date":"2017-03-13T09:45:11.962+0000","type":"User","op":"UPDATE","params":{"id":"bc68f233-09bd-4e51-3257-76bb1ec8c854","up":[{"field":"emails","val":["joe@home.com"]}}
```

## Tasks

This section describes all tasks of the hackathon. All tasks are independent. In case you run
out of time, please spend at least some time on all tasks for a fruitful discussion.

We're looking for code quality, correctness, technical choices, and creativity.

You can use the provided skeleton code as a starting point, which reads the
sample log file and outputs its contents to the command line.

### Task 1: Export CSV file

The Collaborne log files store the core of its data in a nested JSON format.
In contrast, Redshift requires the data in a flat format. Importantly, whereas
each row in the log file might describe changes to multiple fields, the CSV file
must contain a separated row for each field. Similarly, the nested structure of
the CREATE log entries needs to mapped to flat field names, e.g. *collaborne.roles*.

Please implement the code to convert a Collaborne log file into a CSV file with
a format *similar* to this:
```
2017-03-13 02:45:58,660,User,61cc1b08-17ce-4215-9d4b-544fc9135fb1,CREATE,emails,["joe@collaborne.com"]
2017-03-13 02:45:58,660,User,61cc1b08-17ce-4215-9d4b-544fc9135fb1,CREATE,title,Junior Coder
2017-03-13 02:45:58,660,User,61cc1b08-17ce-4215-9d4b-544fc9135fb1,CREATE,collaborne.roles,admin
2018-03-13 02:45:58,660,User,61cc1b08-17ce-4215-9d4b-544fc9135fb1,UPDATE,title,Senior Coder
```

### Task 2: Integrate with AWS (discussion only)

Creating the CSV file is the first step of the journey. Here are the other required steps until our user data is loaded into Redshift:

1. Upload the CSV file to [AWS S3](https://aws.amazon.com/s3/), a hosted storage service

2. Call the Redshift's REST endpoint to trigger the load (whereby one of the request parameters is the S3 location of the CSV file)

For the following, assume that one of your colleagues wrote already a service that triggers the Redshift load itself (step 2).

Please put on your architect hat and prepare to discuss these questions during the Q&A session:

1. Right now, neither your code nor your colleague's service does the S3 upload (step 1). Where would you add this functionality?

2. How would you connect your code with the other service? Assume that you can tell your colleague to implement any mechanism of communication that you wish.

3. Detail the content of the messages that you would exchange with this other service.

3. What are the advantages and disadvantages of your chosen communication approach vs. possible alternatives?

*Hint: Please consider especially reliability, security, and ease-of-development.*

### Task 3: Grow the system (discussion only)

After you successfully loaded the user persistency logs, new requirements have been popping up:

1. Load the persistency logs for groups into Redshift, for example a user might be a member in a R&D group

2. Load realtime click data into Redshift, for example a user clicked on *Edit profile*

3. Send reminder emails when the user didn't update its contact details within the last 12 months ("Is your phone number still correct?")

Please prepare to discuss during the Q&A how to handle those cases. In particular, how does the functionality developed in task 1+2 relate to these new requirements?
