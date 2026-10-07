import Banner from "./Banner"
import CategoryBrowse from "./CategoryBrowse"
import EditorsPicks from "./EditorsPicks"
import NewArrivals from "./NewArrivals"
import Recommened from "./Recommened"

const Home = () => {
  return (
    <div className="bg-white">
      <Banner />
      <NewArrivals />
      <CategoryBrowse />
      <EditorsPicks />
      <Recommened />
    </div>
  );
};

export default Home
