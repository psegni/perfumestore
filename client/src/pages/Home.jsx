import HeroSlideshow from '../components/HeroSlideshow';
import NewArrivals from '../components/NewArrivals';
import Gallery from '../components/Gallery';
import OurShop from '../components/OurShop';
import ContactUs from '../components/ContactUs';

export default function Home() {
  return (
    <>
      <HeroSlideshow />
      <NewArrivals />
      <Gallery />
      <OurShop />
      <ContactUs />
    </>
  );
}
