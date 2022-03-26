/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, {useState} from 'react';
import clsx from 'clsx';
import {useLocation} from '@docusaurus/router';


import {
  useThemeConfig,
  useAnnouncementBar,
  MobileSecondaryMenuFiller,
  ThemeClassNames,
  useScrollPosition,
  useWindowSize,
} from '@docusaurus/theme-common';

import styles from './styles.module.css';

function useShowAnnouncementBar() {
  const {isActive} = useAnnouncementBar();
  const [showAnnouncementBar, setShowAnnouncementBar] = useState(isActive);
  useScrollPosition(
    ({scrollY}) => {
      if (isActive) {
        setShowAnnouncementBar(scrollY === 0);
      }
    },
    [isActive],
  );
  return isActive && showAnnouncementBar;
}

function SimpleSidebarCategory(props) {
  return (
    <div className="pswp-docs__sidebar-menu-item pswp-docs__sidebar-menu-item--category">{props.label}</div>
  );
}
function SimpleSidebarItem(props) {
  const location = useLocation();
  const isActive = (props.href.toLowerCase() === location.pathname.toLowerCase());
    return (
    <a href={props.href} className={clsx(
      'pswp-docs__sidebar-menu-item',
      (isActive ? 'pswp-docs__sidebar-menu-item--active' : '')
    )}>{props.label}</a>
  );
}
function SimpleSidebar(props) {
  const sidebarItems = [];

  let index = 0;
  props.sidebar.forEach((sidebarItem) => {
    if (sidebarItem.type === 'category') {
      sidebarItems.push(<SimpleSidebarCategory {...sidebarItem} key={index} />);
      index++;

      sidebarItem.items.forEach((subItem) => {
        sidebarItems.push(<SimpleSidebarItem {...subItem} key={index} />);
        index++;
      });
    } else if (sidebarItem.type === 'link') {
      sidebarItems.push(<SimpleSidebarItem {...sidebarItem} key={index} />);
      index++;
    }
  });

  return (
    <>
      {sidebarItems}
    </>
  );
}

function DocSidebarDesktop({path, sidebar, onCollapse, isHidden}) {
  const showAnnouncementBar = useShowAnnouncementBar();
  const {
    navbar: {hideOnScroll},
    hideableSidebar,
  } = useThemeConfig();
  
  return (
    <div className="pswp-docs__sidebar-menu">
      <SimpleSidebar sidebar={sidebar} />
    </div>
  );
} // eslint-disable-next-line react/function-component-definition

const DocSidebarMobileSecondaryMenu = ({toggleSidebar, sidebar, path}) => (
  <div className="pswp-docs__sidebar-menu pswp-docs__sidebar-menu--mobile">
    <SimpleSidebar sidebar={sidebar} />
  </div>
);

function DocSidebarMobile(props) {
  return (
    <MobileSecondaryMenuFiller
      component={DocSidebarMobileSecondaryMenu}
      props={props}
    />
  );
}

const DocSidebarDesktopMemo = React.memo(DocSidebarDesktop);
const DocSidebarMobileMemo = React.memo(DocSidebarMobile);
export default function DocSidebar(props) {
  const windowSize = useWindowSize(); // Desktop sidebar visible on hydration: need SSR rendering

  const shouldRenderSidebarDesktop =
    windowSize === 'desktop' || windowSize === 'ssr'; // Mobile sidebar not visible on hydration: can avoid SSR rendering

  const shouldRenderSidebarMobile = windowSize === 'mobile';
  return (
    <>
      {shouldRenderSidebarDesktop && <DocSidebarDesktopMemo {...props} />}
      {shouldRenderSidebarMobile && <DocSidebarMobileMemo {...props} />}
    </>
  );
}
