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

import {ServerConfig} from '../config';
import {Client} from '../controller/Client';
import {DeleteAccountResource} from '../resource/DeleteAccountResource';
import {ForgotPasswordResource} from '../resource/ForgotPasswordResource';
import {IndexResource} from '../resource/IndexResource';
import {ResetPasswordResource} from '../resource/ResetPasswordResource';
import {VerifyAccountResource} from '../resource/VerifyAccountResource';

const Root = (config: ServerConfig) => {
  const client = new Client();
  return [
    ...new ForgotPasswordResource(config, client).getRoutes(),
    ...new VerifyAccountResource(config, client).getRoutes(),
    ...new IndexResource(config, client).getRoutes(),
    ...new DeleteAccountResource(config, client).getRoutes(),
    ...new ResetPasswordResource(config, client).getRoutes(),
  ];
}

export default Root;
