'use client'; 
import Blogs from '@/components/CardsLayout/Blogs';

const BlogPage = () => {
  return (
    <div className="mt-60 grid place-items-center w-full">
      <Blogs
        numberForDisplay={7}
        pagination={true}
      />
    </div>
  );
}

export default BlogPage;
