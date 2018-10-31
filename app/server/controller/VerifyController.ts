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

export class VerifyController {

  public static readonly ROUTE_VERIFY_EMAIL = '/verify';
  public static readonly ROUTE_VERIFY_BOT = '/verify/bot';
  public static readonly ROUTE_VERIFY_PHONE = '/v/:code';

  private static readonly TEMPLATE_VERIFY_EMAIL = 'account/verify_email';
  private static readonly TEMPLATE_VERIFY_BOT = 'account/verify_bot';
  private static readonly TEMPLATE_VERIFY_PHONE = 'account/verify_phone';

  constructor(private readonly config: ServerConfig) {}

  public getRoutes = () => {
    return [
      Router().get(VerifyController.ROUTE_VERIFY_EMAIL, this.handleEmailGet),
      Router().get(VerifyController.ROUTE_VERIFY_BOT, this.handleBotGet),
      Router().get(VerifyController.ROUTE_VERIFY_PHONE, this.handlePhoneGet),
    ];
  };

  private readonly handleEmailGet = async (req: Request, res: Response) => {
    const _ = req.app.locals._;
    const payload = {
      credentials: 'true',
      html_class: 'account verify',
      status: req.query.success ? 'success' : 'error',
      title: _('Verify Account'),
      url: `${this.config.BACKEND_REST}/activate?key=${req.query.key}&code=${req.query.code}`,
    };
    return res.render(VerifyController.TEMPLATE_VERIFY_EMAIL, payload);
  }

  private readonly handleBotGet = async (req: Request, res: Response) => {
    const _ = req.app.locals._;
    const payload = {
      credentials: 'false',
      html_class: 'account verify',
      status: req.query.success ? 'success' : 'error',
      title: _('Verify Bot'),
      url: `${this.config.BACKEND_REST}/provider/activate?key=${req.query.key}&code=${req.query.code}`,
    };
    return res.render(VerifyController.TEMPLATE_VERIFY_BOT, payload);
  }

  private readonly handlePhoneGet = async (req: Request, res: Response) => {
    // TODO Track piwik
    // util.track_event_to_piwik('account.verify-phone', 'success', 200, 1)
    const _ = req.app.locals._;
    const payload = {
      html_class: 'account phone',
      title: _('Verify Phone'),
      url: `${this.config.URL.REDIRECT_PHONE_BASE}/${req.params.code}`,
    };
    return res.render(VerifyController.TEMPLATE_VERIFY_PHONE, payload);
  }
};