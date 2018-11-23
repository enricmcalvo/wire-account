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
import * as BrowserUtil from '../util/BrowserUtil';

export class ResetPasswordResource {

  public static readonly ROUTE_RESET = '/reset';

  private static readonly TEMPLATE_RESET = 'account/reset';

  private accountController: AccountController;

  constructor(private readonly config: ServerConfig, private readonly client: Client) {
    this.accountController = new AccountController(this.config, this.client);
  }

  public getRoutes = () => {
    return [
      Router().get(ResetPasswordResource.ROUTE_RESET, this.handleGet),
      Router().post(ResetPasswordResource.ROUTE_RESET, this.handlePost),
    ];
  };

  private readonly handleGet = async (req: Request, res: Response) => {
    const _ = (req as any)['t'] as Function;
    let status = 'error';
    const error: any = undefined;
    const key = req.query.key;
    const code = req.query.code;

    if (key && code) {
      status = 'init';
    }

    const payload = {
      _,
      code,
      error,
      html_class: 'account forgot',
      key,
      status: req.query.success === '' ? 'success' : status,
      title: _('forgot.title'),
      user_agent: () => BrowserUtil.parseUserAgent(req.header('User-Agent')),
    };
    return res.render(ResetPasswordResource.TEMPLATE_RESET, payload);
  };

  private readonly handlePost = async (req: Request, res: Response) => {
    const _ = (req as any)['t'] as Function;
    let status = 'error';
    let error = '';

    const code = req.fields.code as string;
    const key = req.fields.key as string;
    const password = req.fields.password as string;

    try {
      this.accountController.resetPasswordComplete(key, code, password, req.originalUrl);
    } catch(requestError) {
      if (requestError && requestError.response && requestError.response.status) {
        switch (requestError.response.status) {
          case 400: {
            status = 'error';
            break;
          }
          default: {
            error = _('reset.errorUnknown');
            status = 'fail';
          }
        }
      } else {
        error = _('reset.errorInvalidPassword')
        status = 'fail'
      }
    }

    const payload = {
      _,
      code,
      error,
      html_class: 'account reset',
      key,
      status,
      title: _('reset.title'),
      user_agent: () => BrowserUtil.parseUserAgent(req.header('User-Agent')),
    };
    return res.render(ResetPasswordResource.TEMPLATE_RESET, payload)
  }
}
