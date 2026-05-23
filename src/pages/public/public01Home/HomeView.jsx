import HeroSection from './section/HeroSection';
import EventsPreview from './section/EventsPreview';
import TrainingPlans from './section/TrainingPlans';
import HowItWorks from './section/HowItWorks';
import AboutUs from './section/AboutUs';
import FAQsection from './section/FAQsection';

const HomeView = () => {
  return (
    <>
      <HeroSection />
      <EventsPreview />
      <TrainingPlans />
      <HowItWorks />
      <AboutUs />
      <FAQsection />
    </>
  );
};

export default HomeView;
