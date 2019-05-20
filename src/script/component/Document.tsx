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

import {ContainerLG, Content} from '@wireapp/react-ui-kit';
import React from 'react';
import Footer from 'script/component/document/Footer';
import Header from 'script/component/document/Header';
import {BRAND_NAME} from 'script/Environment';

interface Props extends React.HTMLProps<Document> {
  title?: string;
}

interface ConnectedProps {}

interface DispatchProps {}

const Document: React.FC<Props & ConnectedProps & DispatchProps> = ({title = '', children}) => {
  const pageTitle = BRAND_NAME;
  document.title = title ? `${pageTitle} · ${title}` : pageTitle;
  return (
    <ContainerLG style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
      <Header />
      <Content style={{flexGrow: 1}}>{children}</Content>
      <Footer />
    </ContainerLG>
  );
};

export default Document;
