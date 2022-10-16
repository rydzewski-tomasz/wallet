import { Response, SuperAgentRequest } from 'superagent'
import supertest from 'supertest';
import { AddressInfo, Server } from 'net';

export class Request {
  private requestUtil: supertest.SuperTest<supertest.Test>

  constructor(
    server: Server
  ) {
    const serverUrl = `http://localhost:${Request.getServerPort(server)}`;
    this.requestUtil = supertest(serverUrl);
  }

  async get(url: string, accessToken?: string): Promise<Response> {
    const request = this.requestUtil.get(url).send();
    return Request.makeRequest(request, accessToken);
  }

  async post(url: string, requestBody: any, accessToken?: string): Promise<Response> {
    const request = this.requestUtil.post(url);
    return Request.makeRequest(request, accessToken, requestBody);
  }

  private static getServerPort(server: Server) {
    const address = server.address() as AddressInfo;
    return address.port;
  }

  private static async makeRequest(request: SuperAgentRequest, accessToken?: string, requestBody?: any): Promise<Response> {
    if (accessToken) {
      request.set({ accessToken });
    }

    return request.send(requestBody);
  }
}
