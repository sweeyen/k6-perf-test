# K6

Grafana k6 is an open-source load testing tool that makes performance testing easy and productive for engineering teams. k6 is free, developer-centric, and extensible.

## Installation

Execute command below in powershell.

```winget
winget install k6 --source winget
```

## How to run the test
Locate to the folder where the test exists.
Execute the test.

```
k6 run <testscriptname>.js
```

## Check Test Result

Result is stored at ``Result`` folder in html / junit format. 