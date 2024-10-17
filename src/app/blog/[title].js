'use client'; 
import Blogs from '@/components/CardsLayout/Blogs';

const BlogPage = () => {
  return (
    <div>
      <h1>Blogs</h1>
      <p>Welcome to the blogs page!</p>
      <Blogs
        title={'Blog'}
        numberForDisplay={6}
        pagination={true}
      />
    </div>
  );
}

export default BlogPage;
