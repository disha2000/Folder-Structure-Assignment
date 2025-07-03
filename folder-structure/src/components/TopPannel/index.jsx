import BreadCrumbNavigation from "./BreadCrumbNavigation";
import ContextMenu from "./ContextMenu";
import './index.css'

const TopPannel = () => {
  return (
    <section className="top-pannel-section flex-col-container">
      <BreadCrumbNavigation />
      <ContextMenu/>
    </section>
  );
};

export default TopPannel;
