import http from 'k6/http';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary, jUnit } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { check, group, sleep, fail } from 'k6';
import { describe, expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.2/index.js';
import * as authenticate from './setup/Authentication.js';
import * as report from './setup/Reporting.js';


const url = 'https://reqres.in';
let userId = null;

export const options = {
    vus: 20, 
    // duration: '30s', 
    iterations: 20,

    thresholds: {
        http_req_failed: [{ threshold: "rate<0.1", abortOnFail: false }], // http errors should be less than 10%
        http_req_duration: ['p(99)<2000'], // 99% of requests should be below 2s
    },
};

export function setup() {
    let name = 'sy'.concat(Math.random().toString(36).substring(2, 5));;
    let job = 'Job'.concat(name);

    const requestBody = {
        name: name,
        job: job
    };

    describe('Create user', () => {
        let response = http.post(url.concat('/api/users'), requestBody, null);
        console.log("response status : " + response.status);
        expect(response.status, 'Response Status ' + response.status).to.equal(201);
        expect(response.json('name'), 'Name ').to.equal(name);


        userId = response.json('id');
    })

    return { userId };
}


export default function main({ userId }) {

    describe('Get user based on Id', () => {

        let userResponse = http.get(url.concat(`/api/users/${userId}`), null);
        expect(userResponse.status, "Get user response status ").to.equal(404);
        //website do not store new user, therefore expecting to return 404.
        //change the expected result to adapt to your test


    })
}

export function teardown({ userId }) {

}

export function handleSummary(objData) {
    let strCurrentFileBaseName = 'GetUserTest';
    let strCurrentDateTime = report.yyyyMMddHHmmss();
    let strSummaryHtmlFileName = './result/' + strCurrentFileBaseName + '.summary_' + strCurrentDateTime + '.html';
    let strSummaryJunitFileName = './result/' + strCurrentFileBaseName + '.summary_' + strCurrentDateTime + '_junit.xml';
    return {
        [strSummaryHtmlFileName]: htmlReport(objData),
        [strSummaryJunitFileName]: jUnit(objData),
        stdout: textSummary(objData, { indent: ' ', enableColors: true })
    };
}
