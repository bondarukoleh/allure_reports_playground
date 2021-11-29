# AllureServer
Server to store and provide allure reports. <br>
Using the [Express][express] as server and [Allure][allure] as reporter.

***

### Environment
<details>
  <summary>Environment details</summary>

##### Needed software should be installed
* GIT - [Git download][git]
* Node.js 14th LTS version - [Node download][node]
* (Optional) Docker - if you want to run as a docker container - [Docker][docker]
* (Optional) Java - if you don't want docker - [Java download][java]
</details>

***

### Installation dependencies
<details>
  <summary>Installation steps</summary>

You should have access to the current repo. Preferable add a ssh key to your GitHub account.

1. Navigate to folder in which framework will be stored, and run in your terminal copied link (with ssh key):
```shell
git clone git@github.com:bondarukoleh/allure_reports_playground.git
```
2. Navigate into downloaded "AllureServer" repository folder
```shell
cd /allure_reports_playground/allure_server/
```
3. Install all required dependencies:
```shell
npm i
```
</details>

***

### Server run
<details>
  <summary>Ways to run a server</summary>

There are a couple ways to run server, all of them __require providing SECRET_KEY environment variable before run!__

#### 1. Run with TypeScript
This way you don't need to compile TypeScript to JavaScript. <br>
You can use command:
```shell
npm run start:ts
```

#### 2. Run with Docker
You can use __docker__ to start a server <br>
__Be aware__ that this way will store the allure results in `~/allure-data/` folder of your host machine. <br>
Also, docker will compile TS to JS and run JS.
You can use helper scripts:
```shell
# If you would like to clean previous allure docker results 
./cleanAllure.sh

# To build the image and run container
./runAllure.sh
```
If you want to know more, please take a look on [Dockerfile][dockerfile]
</details>

***

### How to use
<details>
  <summary>Server details</summary>

Main purpose of the allure server is to store the allure results and to generate the allure reports. <br>
You need to zip the allure-results folder after your tests run, name zip with BUILD_ID of your CI pipeline, <br>
add some information about tests', like environment, suite, CI job name, and send it to the server.

Server has authentication, so you need to log in before you can send the results.

***

#### From UI
Server is running by default on __port 4000__ on your local machine. <br>
So to check it out you can go to [http://localhost:4000/][home]

##### Login
No DB is added so far, so creds are encrypted and stored __hardcoded__ [here][users]. <br>
You need to know the User creds in order to log in to server, please contact your administrator.

Please go to [http://localhost:4000/login][login], enter the creds and press login button

##### Get Report
Please go to [http://localhost:4000/reports][reports] to see the report. <br>
You need to know a build number to get a report from it. <br>
Please insert a build number to the input field, and press "Get report" button

***

#### From API
To send the results via API, you need to do a couple of things. <br>
Example how AQA send results you can find in [report helpers][zipSendExample]

1. Zip the `allure-results` folder after your test run, and name it with BUILD_ID of the CI Pipeline
2. Gather the information about the tests in array, i.e. `['TEST_ENVIRONMENT', 'TEST_SUITE', 'JOB_NAME']`, etc
3. Login to the server
4. Send the zip archive to the server. Please check the API spec above.

After you send the zip, in response you should get the URL you can find generated report.

</details>

***

### API
<details>
  <summary>Endpoints details</summary>

### **Login**

Login to server

```http
POST /login
```
- Request headers

| Header | Value |
|----------|-------------|
| `Content-Type` |  `application/x-www-form-urlencoded` |

- Request body
  UTF-8 encoded string.
```text
username=USER_NAME&password=USER_PASS&fromApi=true
```

- Response headers

  | Header | Value |
    | ------ | ----------- |
  | `Set-Cookie` | `allure-cookie=cookie_value;` |

You can get a `Set-Cookie` header from response.

***
### **Upload Results**

Upload allure results to server

```http
POST /upload-results
```
- Request headers

| Header | Value |
|----------|-------------|
| `Content-Type` |  `application/x-www-form-urlencoded` |
| `Cookie` |  `allure-cookie=cookie_value;` |

- Request body

You need to provide the zip archive. **Name archive with your build_id**. Check how you can form the request with file. <br>
Maybe it is worth checking the [FormData][formData] possibilities.

And you need to provide stringifies array of test run information. <br>
e.g. `['TEST_ENVIRONMENT', 'TEST_SUITE', 'JOB_NAME']`
```text
allureArchive=your_archive_data&reportTypes=your_report_types
```

- Response body
  Url to generated report
```text
http://localhost/reports/12345
```

***
### **Get Report**

```http
GET /reports
```
- Request headers

| Header | Value |
|----------|-------------|
| `Cookie` |  `allure-cookie=cookie_value;` |

- Request query

| Parameter | Type     | Description       |
| --------- | -------- | ----------------- |
| `buildNumber` | `string` | Build number |

- Response

Redirection to served report for provided build number.

***

### Other endpoints:

| Endpoint | Method | Description |
| ------------- | ----------- | ----------- |
| `/status` | `GET` | Should return message that server is running. Used only for testing |
| `/login` | `GET` | If User is logged in, redirects to `/reports` if not sends the `login.html` page |
| `/reports/_your_report_id_` | `GET` | Should redirect to report, or return 404 if such report id is not found |
| `/reports` | `GET` | If User didn't provide query - sends the `reorts.html` |
| `reports/_path_to_report_` | `GET` | Trying to find report by path  |
| `reports/upload-results` | `GET` | Returns a text that user should provide the report ID |

</details>

***

### Server details
<details>
  <summary>Some details about the server implementation</summary>

##### Authentication:
Implemented with [express-session][express-session] package. So to get access you need a cookie. Check it out [here][middleware]

##### File upload
To get a zip file [multer][multer] is used. Configuration is [here][fileUpload]

##### Reports by path
Information with zipped results that you need to provide, will make a path server will store the results.
So from `['QA_ENV', 'REGRESSION_SUITE', 'AQA_CORE_JOB']`, results will be stored with
`/QA_ENV/REGRESSION_SUITE/AQA_CORE_JOB/BUILD_ID` path. That is needed for gathering statistics from test runs,
because it will be a mess to store the `/DEV_ENV/CUSTOM_SUITE/DEV_DEBUG_JOB` with `/QA_ENV/REGRESSION_SUITE/AQA_CORE_JOB`.

##### Why we need copy the history from last previous report:
This is because allure made that way. In order to get a trends, and statistics, tests history and so on, we need
to copy `history` folder from previous test `report` to current test `results`, in order to generate new report
with previous statistics.

##### Why docker run stores the results outside the repository:
Because if something will wipe the repository with code - you always will have a backup of your data, as long
as host machine is functioning.

##### Improvements
1. Improve the request handling and response messages. Instead of text, use JSON and some unified errors.
2. Improve the documentation. Swagger would be nice to add.
3. Improve `/upload-results` url to get the BUILD_ID not from zip name, but from body of the request
4. Add logging
5. Add tests unit, integration, and e2e

</details>

[git]: https://git-scm.com/downloads
[node]: https://nodejs.org/en/
[dockerfile]: Dockerfile
[docker]: https://www.docker.com/
[allure]: https://docs.qameta.io/allure/#_about
[java]: https://www.java.com/en/download/
[express]: https://expressjs.com/
[users]: src/data/users.ts
[home]: http://localhost:4000/
[login]: http://localhost:4000/login
[reports]: http://localhost:4000/reports
[zipSendExample]: ../report_helpers/zipAndSendResult.js
[express-session]: https://www.npmjs.com/package/express-session
[middleware]: src/startup/middleware.ts
[multer]: https://www.npmjs.com/package/multer
[fileUpload]: src/middleware/fileUpload.ts
[formData]: https://developer.mozilla.org/en-US/docs/Web/API/FormData

