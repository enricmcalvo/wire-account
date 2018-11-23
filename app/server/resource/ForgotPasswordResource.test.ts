/*
 * Wire
 * Copyright (C) 2018 Wire Swiss GmbH
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 *
 */

import {AxiosResponse} from 'axios';
import {Request, Response} from "express";
import {ServerConfig} from "../config";
import {AccountController} from "../controller/AccountController";
import {Client} from "../controller/Client";
import {ForgotPasswordResource} from "./ForgotPasswordResource";

describe('ForgotPasswordResource', () => {
  describe('handlePost', () => {
    it('renders the success page if valid email is provided', async () => {
      const renderSpy = jasmine.createSpy();
      const accountController: any = {
        resetPassword: () => Promise.resolve({response: {status: 200}}),
      };
      const config = {};
      const client = {};
      const resource = new ForgotPasswordResource(config as ServerConfig, client as Client);
      resource['accountController'] = accountController as AccountController;

      const req: any = {
        fields: {
          email: 'email@email.com',
        },
        t: (text: string) => text,
      };
      const res: any = {
        render: renderSpy,
      };

      await resource['handlePost'](req as Request, res as Response);
      expect(renderSpy.calls.count()).toBe(1);
      expect(renderSpy.calls.mostRecent().args.length).toBe(2);
      expect(renderSpy.calls.mostRecent().args[0]).toBe(ForgotPasswordResource['TEMPLATE_FORGOT']);
      expect(renderSpy.calls.mostRecent().args[1].status).toEqual('success');
    });

    it('renders the error page if invalid email is provided', async () => {
      const renderSpy = jasmine.createSpy();
      const accountController: any = {
        resetPassword: () => Promise.reject(),
      };
      const config = {};
      const client = {};
      const resource = new ForgotPasswordResource(config as ServerConfig, client as Client);
      resource['accountController'] = accountController as AccountController;

      const req: any = {
        fields: {
          email: undefined,
        },
        t: (text: string) => text,
      };
      const res: any = {
        render: renderSpy,
      };

      await resource['handlePost'](req as Request, res as Response);
      expect(renderSpy.calls.count()).toBe(1);
      expect(renderSpy.calls.mostRecent().args.length).toBe(2);
      expect(renderSpy.calls.mostRecent().args[0]).toBe(ForgotPasswordResource['TEMPLATE_FORGOT']);
      expect(renderSpy.calls.mostRecent().args[1].error).toEqual('forgot.errorInvalidEmail');
      expect(renderSpy.calls.mostRecent().args[1].status).toEqual('error');

      req.fields.email = 'a@a';
      await resource['handlePost'](req as Request, res as Response);
      expect(renderSpy.calls.mostRecent().args[1].error).toEqual('forgot.errorInvalidEmail');

      req.fields.email = ' ';
      await resource['handlePost'](req as Request, res as Response);
      expect(renderSpy.calls.mostRecent().args[1].error).toEqual('forgot.errorInvalidEmail');
    });

    it('renders the error page if backend returns error', async () => {
      const renderSpy = jasmine.createSpy();
      const accountController: any = {
        trackEvent: () => {},
      };
      const config = {};
      const client = {};
      const resource = new ForgotPasswordResource(config as ServerConfig, client as Client);
      resource['accountController'] = accountController as AccountController;

      const req: any = {
        fields: {
          email: 'email@email.com',
        },
        t: (text: string) => text,
      };
      const res: any = {
        render: renderSpy,
      };

      accountController['resetPassword'] = (): Promise<AxiosResponse> => Promise.reject({response: {status: ForgotPasswordResource['HTTP_STATUS_EMAIL_IN_USE']}}) as Promise<AxiosResponse>;
      await resource['handlePost'](req as Request, res as Response);
      expect(renderSpy.calls.mostRecent().args[1].status).toEqual('error');
      expect(renderSpy.calls.mostRecent().args[1].error).toEqual('forgot.errorUnusedEmail');

      accountController['resetPassword'] = (): Promise<AxiosResponse> => Promise.reject({response: {status: ForgotPasswordResource['HTTP_STATUS_EMAIL_ALREADY_SENT']}}) as Promise<AxiosResponse>;
      await resource['handlePost'](req as Request, res as Response);
      expect(renderSpy.calls.mostRecent().args[1].status).toEqual('error');
      expect(renderSpy.calls.mostRecent().args[1].error).toEqual('forgot.errorAlreadyProcessing');

      accountController['resetPassword'] = (): Promise<AxiosResponse> => Promise.reject({response: {status: 9999}}) as Promise<AxiosResponse>;
      await resource['handlePost'](req as Request, res as Response);
      expect(renderSpy.calls.mostRecent().args[1].status).toEqual('error');
      expect(renderSpy.calls.mostRecent().args[1].error).toEqual('forgot.errorUnknown');
    });
  });
});
