import {Request, Response} from "express";
import {ServerConfig} from "../config";
import {AccountController} from "../controller/AccountController";
import {Client} from "../controller/Client";
import {DeleteAccountResource} from "./DeleteAccountResource";

describe('DeleteAccountResource', () => {
  describe('handlePost', () => {
    it('renders the error page if key or code is not provided', async () => {
      const renderSpy = jasmine.createSpy();
      const accountController: any = {
        deleteAccount: () => {},
      };
      const config = {};
      const client = {};
      const controller = new DeleteAccountResource(config as ServerConfig, client as Client);
      controller['accountController'] = accountController as AccountController;
      const req: any = {
        fields: {
          code: undefined,
          key: undefined,
        },
        t: (text: string) => text,
      };
      const res: any = {
        render: renderSpy,
      };

      await controller['handlePost'](req as Request, res as Response);
      expect(renderSpy.calls.count()).toBe(1);
      expect(renderSpy.calls.mostRecent().args.length).toBe(2);
      expect(renderSpy.calls.mostRecent().args[0]).toBe(DeleteAccountResource['TEMPLATE_DELETE']);
      expect(renderSpy.calls.mostRecent().args[1].status).toEqual('error');
    });
  });
});
