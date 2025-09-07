import http from 'k6/http';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary, jUnit } from 'https://jslib.k6.io/k6-summary/0.1.0/index.js';
import { check, group, sleep, fail } from 'k6';
import { describe, expect } from 'https://jslib.k6.io/k6chaijs/4.5.0.1/index.js';
import * as authenticate from './setup/Authentication.js';
import * as report from './setup/Reporting.js';

const url = 'https://reqres.in';
let userId = null;
let headerList = { 'Content-Type': 'application/x-www-form-urlencoded', 'x-api-key': 'reqres-free-v1' };

export const options = {
    vus: 20, 
    // duration: '30s', 
    iterations: 20,

    thresholds: {
        checks: [{ threshold: "rate>0.95", abortOnFail: false }], // http errors should be less than 10%
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
        let response = http.post(url.concat('/api/users'), requestBody, {headers: headerList}, null);
        console.log("response status : " + response.status);
        expect(response.status, 'Response Status ' + response.status).to.equal(201);
        expect(response.json('name'), 'Name ').to.equal(name);

        userId = response.json('id');
    })
    return { userId };
}


export default function main({ userId }) {
    // Due to reqres.in does not allow user to actual created, it returns 404 for get user api.
    // In real scenario, it should return 200.
    // For demo purpose, I am using a dummy user Id.
    describe('Get user based on Id', () => {
        let userResponse = http.get(url.concat('/api/users/4'), { headers: headerList }, null);
        expect(userResponse.status, "Get user response status ").to.equal(200);
        expect(userResponse.json().data.first_name, `User First Name ${userResponse.json().data.first_name}`).to.equal('Eve');
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
