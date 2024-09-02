import CardComponent from "../CardComponent";
import { Divider } from "@nextui-org/divider";
import Button from "../Button";

const Blogs = ({
    title = 'Blog',
    numberForDisplay,
    blogs = mockBlogs,
    pagination = false
}) => {
    function goToSingleBlog() {
        //TODO: navigate to the single blog post
    }

    let limitedBlogs = numberForDisplay ? blogs.slice(0,numberForDisplay) : blogs
    return (
        <div className="blogs-container">
            {title && <span className="blog-title">{title}</span>}
            {title && <Button
                key={`section-component-title-button-${sectionType}`}
                type={'outlined-dark'}
                name={'Pogledaj sve objave'}
                onClick={onClick}
            />}
            {title && <Divider className="section-divider"/>}
            <div className="blog-container">
                {limitedBlogs.map((blog, index) => {
                    <div className="blog-card">
                        <CardComponent 
                            key={`blog-card-${index}`}
                            imageSrc={blog.coverImage}
                            imageWidth={438}
                            imageHeight={344}
                            imageRadius={"30px"}
                            imageAltText={`Blog post - ${blog.title}`}
                            sectionType={'blog'}
                            author={blog.author}
                            title={blog.title}
                            creationDate={blog.creationDate}
                            onClick={goToSingleBlog()}
                            buttonText="Pročitaj više"
                        />
                    </div>
                })}
            </div>
            {/* pagination */}
            {pagination && <Divider className="section-divider"/>}
            {/* {pagination && <PaginationComponent />} */}
        </div>
    )
}

const mockBlogs = [
    {
        id: 1,
        title: 'Lorem ipsum dolor sit amet',
        author: 'Petar Petrović',
        creationDate: '10 Maj ‘24 ',
    },
    {
        id: 2,
        title: 'Lorem ipsum dolor sit amet',
        author: 'Petar Petrović',
        creationDate: '10 Maj ‘24 ',
    },
    {
        id: 3,
        title: 'Lorem ipsum dolor sit amet',
        author: 'Petar Petrović',
        creationDate: '10 Maj ‘24 ',
    },
    {
        id: 4,
        title: 'Lorem ipsum dolor sit amet',
        author: 'Petar Petrović',
        creationDate: '10 Maj ‘24 ',
    },
    {
        id: 5,
        title: 'Lorem ipsum dolor sit amet',
        author: 'Petar Petrović',
        creationDate: '10 Maj ‘24 ',
    },
    {
        id: 6,
        title: 'Lorem ipsum dolor sit amet',
        author: 'Petar Petrović',
        creationDate: '10 Maj ‘24 ',
    },
    {
        id: 7,
        title: 'Lorem ipsum dolor sit amet',
        author: 'Petar Petrović',
        creationDate: '10 Maj ‘24 ',
    },
];

export default Blogs;