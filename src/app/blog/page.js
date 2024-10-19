'use client'; 
import Blogs from '@/components/CardsLayout/Blogs';

const BlogPage = () => {
  return (
    <div className="mt-60 grid place-items-center pb-24  w-full bg-[#F0F0F0]">
      {/* <h1>Blogs</h1>
      <p>Welcome to the blogs page!</p> */}
      <Blogs
        numberForDisplay={6}
        pagination={true}
      />
    </div>
  );
}

export default BlogPage;