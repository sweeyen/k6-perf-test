import http from 'k6/http';
import { describe, expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.2/index.js';


const clientid = '';
const clientsecret = '';

export function authenticateUsingAzure() {
  let url = '';
  let granttype = '';
  let audience = '';
  let adminToken = null;


  const requestBody = {
    client_id: clientid,
    client_secret: clientsecret,
    grant_type: granttype,
    audience: audience
  };

  describe('Get Token', () => {
    let response = http.post(url, requestBody);
    expect(response.status, 'Response Status ' + response.status).to.equal(200);
    expect(response.json('access_token'), 'Access Token').to.not.equal(null);

    adminToken = response.json('access_token');
  })

  return adminToken;
}

export function authenticateAdminUsingAzure() {
  let url = '';
  let granttype = '';
  let audience = '';
  let adminToken = null;


  const requestBody = {
    client_id: adminClientid,
    client_secret: adminClientSecret,
    grant_type: granttype,
    audience: audience
  };

  describe('Get Admin Token', () => {
    let response = http.post(url, requestBody);
    expect(response.status, 'Response Status ' + response.status).to.equal(200);
    expect(response.json('access_token'), 'Access Token').to.not.equal(null);

    adminToken = response.json('access_token');
  })

  return adminToken;
}
