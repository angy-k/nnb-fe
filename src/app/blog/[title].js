'use client'; 
import Blogs from '@/components/CardsLayout/Blogs';

const BlogPage = () => {
  return (
    <div>
      <h1>Blogs</h1>
      <p>Welcome to the blogs page!</p>
      <Blogs
        title={'Pročitaj još'}
        sectionType={'blog'}
        numberForDisplay={3}
        pagination={false}
      />
    </div>
  );
}

export default BlogPage;
