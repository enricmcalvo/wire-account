/*
 * Wire
 * Copyright (C) 2019 Wire Swiss GmbH
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
import {Button, COLOR, ContainerXS, H1, Input, Text} from '@wireapp/react-ui-kit';
import React, {useContext, useState} from 'react';
import {useTranslation} from 'react-i18next';
import Document from 'script/component/Document';
import {ActionContext} from 'script/module/action/actionContext';

const HTTP_STATUS_EMAIL_NOT_IN_USE = 400;
const HTTP_STATUS_EMAIL_ALREADY_SENT = 409;

const PasswordForgot = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [t] = useTranslation('forgot');
  const {accountAction} = useContext(ActionContext);
  const initiatePasswordReset = async () => {
    try {
      setError('');
      await accountAction.initiatePasswordReset(email);
      setSuccess(true);
    } catch (error) {
      switch (error.code) {
        case HTTP_STATUS_EMAIL_NOT_IN_USE: {
          setError(t('errorUnusedEmail'));
          break;
        }
        case HTTP_STATUS_EMAIL_ALREADY_SENT: {
          setError(t('errorAlreadyProcessing'));
          break;
        }
        default: {
          setError(t('errorUnknown'));
          console.error('Failed to initiate password reset', error);
        }
      }
    }
  };
  return (
    <Document>
      <ContainerXS style={{display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto'}}>
        {success ? (
          <React.Fragment>
            <H1>{t('successTitle')}</H1>
            <p>{t('successDescription')}</p>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <H1>{t('title')}</H1>
            <Input
              autoFocus
              onChange={event => setEmail(event.currentTarget.value)}
              placeholder={t('Email')}
              name="email"
              type="email"
              data-uie-name="enter-email"
              onKeyDown={event => {
                if (event.key === 'Enter') {
                  initiatePasswordReset();
                }
              }}
            />
            <Text textTransform="uppercase" center color={COLOR.RED} data-uie-name="error-message">
              {error}
            </Text>
            <Button
              onClick={initiatePasswordReset}
              style={{marginTop: 16}}
              data-uie-name="do-send-password-reset-email"
            >
              {t('button')}
            </Button>
          </React.Fragment>
        )}
      </ContainerXS>
    </Document>
  );
};

export default PasswordForgot;