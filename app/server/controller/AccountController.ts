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

import {ServerConfig} from "../config";
import {Client} from "./Client";
import {TrackingController} from "./TrackingController";

export class AccountController {


  private trackingController: TrackingController;

  constructor(private readonly config: ServerConfig, private readonly client: Client) {
    this.trackingController = new TrackingController(config, client);
  }

  public readonly deleteAccount = async (key: string, code: string, url: string) => {
    try {
      const result = await this.client.post(`${this.config.BACKEND_REST}/delete`, {key, code})
      this.trackingController.trackEvent(url, 'account.delete', 'success', result.status, 1);
      status = 'success';
    } catch (requestError) {
      status = 'error';
      this.trackingController.trackEvent(url, 'account.delete', 'fail', requestError.status, 1);
    }
  };

  public readonly resetPassword = async (email: string, url: string) => {
    const sanitizedEmail = (email || '').toLowerCase().trim();
    const emailRegex = /[^@]+@[^@]+\.[^@]+/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email');
    } else {
      try {
        const result = await this.client.post(`${this.config.BACKEND_REST}/password-reset`, {sanitizedEmail});
        this.trackingController.trackEvent(url, 'account.forgot', 'success', result.status, 1);
        status = 'success';
      } catch (requestError) {
        this.trackingController.trackEvent(url, 'account.forgot', 'fail', requestError.status, 1);
        throw requestError;
      }
    }
  };

  public readonly resetPasswordComplete = async (key: string, code: string, password: string, url: string) => {
    if (!password || password.length < 8) {
      throw new Error('Invalid password');
    } else if (key && code){
      try {
        const result = await this.client.post(`${this.config.BACKEND_REST}/password-reset/complete`, {password, key, code})
        this.trackingController.trackEvent(url, 'account.reset', 'success', result.status, 1);
        status = 'success';
      } catch (requestError) {
        this.trackingController.trackEvent(url, 'account.reset', 'fail', requestError.status, 1);
        throw requestError;
      }
    }
  }

};
