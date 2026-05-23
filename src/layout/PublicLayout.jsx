import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import NavbarTemplate from '../components/template/public/NavbarTemplate';
import FooterTemplate from '../components/template/public/FooterTemplate';
import Loading from '../components/common/Loading';
import ScrollToTop from '../components/common/ScrollToTop';

const PublicLayout = () => {
  return (
    <>
      <ScrollToTop />
      <NavbarTemplate />
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
      <FooterTemplate />
    </>
  );
};

export default PublicLayout;
