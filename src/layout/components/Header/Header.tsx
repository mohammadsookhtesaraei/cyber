import { ReactElement } from 'react';

import ThemeToggle from './components/ThemeToggle';

const Header = (): ReactElement => {
  return (
    <div className="">
      <ThemeToggle />
    </div>
  );
};

export default Header;
