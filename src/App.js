import Header from './Header';
import Nav from './Nav';
import Footer from './Footer';
import Home from './Home';
import NewPost from './NewPost';
import PostPage from './PostPage';
import About from './About';
import Missing from './Missing';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Routes, Route } from 'react-router-dom';
import api from './api/Posts.js';
import Edit from './Edit.js';


function App() {
  const [editTitle,seteditTitle]=useState("")
  const [editBody,seteditBody]=useState("")
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "My First Post",
      datetime: "July 01, 2021 11:17:36 AM",
      body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis consequatur expedita, assumenda similique non optio! Modi nesciunt excepturi corrupti atque blanditiis quo nobis, non optio quae possimus illum exercitationem ipsa!"
    },
    {
      id: 2,
      title: "My 2nd Post",
      datetime: "July 01, 2021 11:17:36 AM",
      body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis consequatur expedita, assumenda similique non optio! Modi nesciunt excepturi corrupti atque blanditiis quo nobis, non optio quae possimus illum exercitationem ipsa!"
    },
    {
      id: 3,
      title: "My 3rd Post",
      datetime: "July 01, 2021 11:17:36 AM",
      body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis consequatur expedita, assumenda similique non optio! Modi nesciunt excepturi corrupti atque blanditiis quo nobis, non optio quae possimus illum exercitationem ipsa!"
    },
    {
      id: 4,
      title: "My Fourth Post",
      datetime: "July 01, 2021 11:17:36 AM",
      body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis consequatur expedita, assumenda similique non optio! Modi nesciunt excepturi corrupti atque blanditiis quo nobis, non optio quae possimus illum exercitationem ipsa!"
    }
  ])
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  useEffect(()=>{
    const fetchPosts = async()=>{
      try{
        const response =  await api.get('/posts');
        setPosts(response.data)
      }catch(err){
        if(err.response){
        console.log(err.response.data)
        console.log(err.response.status)
        console.log(err.response.headers)
      }else{
        console.log('Error:${err.message}');
      }
      }
    }
    fetchPosts();
  },[])

  useEffect(() => {
    const filteredResults = posts.filter((post) =>
      ((post.body).toLowerCase()).includes(search.toLowerCase())
      || ((post.title).toLowerCase()).includes(search.toLowerCase()));

    setSearchResults(filteredResults.reverse());
  }, [posts, search])

  const handleSubmit = async(e) => {
    try{
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const newPost = { id, title: postTitle, datetime, body: postBody };
    const response = await api.post("/posts",newPost)
    const allPosts = [...posts, newPost];
    setPosts(allPosts);
    setPostTitle('');
    setPostBody('');}
    catch(err){
      console.log("error occured")
    }
  }

  const handleDelete = async(id) => {
    const postsList = posts.filter(post => post.id !== id);
    const response = await api.delete(`posts/${id}`);
    setPosts(postsList);
  }

  const handleEdit = async(id)=>{
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const updatePost = { id, title: editTitle, datetime, body: editBody };
    try{
      const response = await api.put(`/posts/${id}`,updatePost)
      setPosts(posts.map(post=>post.id===id ? {...response.data}:post));
      seteditTitle('');
      seteditBody('');}
catch(err){
      console.log(err.message)
    }
  }

  return (
  <div className="App">
    <Header title="EDWAC" slogan="Even Dead We are Connected" />
    <Nav search={search} setSearch={setSearch} />
    <Routes>
      <Route path="/" element={<Home posts={searchResults} />} />
      <Route path="/post" element={<NewPost handleSubmit={handleSubmit} postTitle={postTitle} setPostTitle={setPostTitle} postBody={postBody} setPostBody={setPostBody} />} />
      <Route path="/edit/:id" element={<Edit posts={posts} handleEdit={handleEdit} editBody={editBody} setEditBody={seteditBody} setEditTitle={seteditTitle} />} />
      <Route path="/post/:id" element={<PostPage posts={posts} handleDelete={handleDelete} />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<Missing />} />
    </Routes>
    <Footer />
  </div>
);


}

export default App;