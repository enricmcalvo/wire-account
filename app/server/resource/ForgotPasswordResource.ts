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

import {Request, Response, Router} from "express";
import {ServerConfig} from "../config";
import {AccountController} from "../controller/AccountController";
import {Client} from "../controller/Client";

export class ForgotPasswordResource {

  public static readonly ROUTE_FORGOT = '/forgot';
  private static readonly TEMPLATE_FORGOT = 'account/forgot';

  private static readonly HTTP_STATUS_EMAIL_IN_USE = 400;
  private static readonly HTTP_STATUS_EMAIL_ALREADY_SENT = 409;

  private accountController: AccountController;

  constructor(private readonly config: ServerConfig, private readonly client: Client) {
    this.accountController = new AccountController(this.config, this.client);
  }

  public getRoutes = () => {
    return [
      Router().get(ForgotPasswordResource.ROUTE_FORGOT, this.handleGet),
      Router().post(ForgotPasswordResource.ROUTE_FORGOT, this.handlePost),
    ];
  };

  private readonly handleGet = async (req: Request, res: Response) => {
    const _ = (req as any)['t'] as Function;
    const error: string = undefined;
    const payload = {
      _,
      error,
      html_class: 'account forgot',
      status: 'init',
      title: _('forgot.title'),
    };
    return res.render(ForgotPasswordResource.TEMPLATE_FORGOT, payload);
  };

  private readonly handlePost = async (req: Request, res: Response) => {
    const _ = (req as any)['t'] as Function;
    let status;
    let error;

    try {
      await this.accountController.resetPassword(req.fields.email as string, req.originalUrl);
      status = 'success';
    } catch(requestError) {
      if (requestError && requestError.response && requestError.response.status) {
        switch (requestError.response.status) {
          case ForgotPasswordResource.HTTP_STATUS_EMAIL_IN_USE: {
            error = _('forgot.errorUnusedEmail');
            status = 'error';
            break;
          }
          case ForgotPasswordResource.HTTP_STATUS_EMAIL_ALREADY_SENT: {
            error = _('forgot.errorAlreadyProcessing');
            status = 'error';
            break;
          }
          default: {
            error = _('forgot.errorUnknown');
            status = 'error';
          }
        }
      } else {
        error = _('forgot.errorInvalidEmail');
        status = 'error';
      }
    }



    const payload = {
      _,
      error,
      html_class: 'account forgot',
      status,
      title: _('forgot.title'),
    };
    return res.render(ForgotPasswordResource.TEMPLATE_FORGOT, payload);
  }
};
