/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import {ThemeClassNames} from '@docusaurus/theme-common';
export default function EditThisPage({editUrl}) {
  return (
    <>Found a typo? <a href={editUrl}
        target="_blank"
        rel="noreferrer noopener"
        className={ThemeClassNames.common.editThisPage}>Edit this page</a></>
  );
}
