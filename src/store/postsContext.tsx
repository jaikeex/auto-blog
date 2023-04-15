import * as React from 'react';
import { useReducer, useState } from 'react';
import { Post } from 'types/post';

export interface PostsContextProps {
  posts: Post[];
  allPostsLoaded: boolean;
  setPostsFromSSR: (posts: Post[]) => void;
  loadPosts: (lastPostDate: string, getNewerPosts?: boolean) => void;
  deletePost: (postId: string) => void;
}

const PostsContext = React.createContext<PostsContextProps>({
  posts: [],
  allPostsLoaded: false,
  setPostsFromSSR: () => {},
  loadPosts: () => {},
  deletePost: () => {}
});

interface PostReducerAction {
  type: 'ADD_POSTS' | 'DELETE_POST' | 'RELOAD_POSTS';
  posts?: Post[];
  postId?: string;
}

export const usePostContext = () => React.useContext(PostsContext);

const postReducer = (state: Post[], action: PostReducerAction) => {
  let newState: Post[];
  switch (action.type) {
    case 'RELOAD_POSTS':
      newState = action.posts;
      return newState;
    case 'ADD_POSTS':
      newState = [...state];
      action.posts.forEach((post: Post) => {
        !newState.find((p) => p._id === post._id) && newState.push(post);
      });
      return newState;
    case 'DELETE_POST':
      newState = [];
      state.forEach((post: Post) => post._id !== action.postId && newState.push(post));
      return newState;
    default:
      return state;
  }
};

export const PostsProvider = ({ children }) => {
  const [posts, dispatchPosts] = useReducer(postReducer, []);
  const [allPostsLoaded, setAllPostsLoaded] = useState<boolean>(false);

  const setPostsFromSSR = React.useCallback((postsFromSSR = []) => {
    if (postsFromSSR.length === 0) {
      setAllPostsLoaded(true);
    }
    dispatchPosts({ type: 'RELOAD_POSTS', posts: postsFromSSR });
  }, []);

  const loadPosts = React.useCallback(async (lastPostDate: string, getNewerPosts = false) => {
    console.log(lastPostDate);
    const result = await fetch('/api/get-posts', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ lastPostDate, getNewerPosts })
    });
    const json = await result.json();
    const postResult: Post[] = json.posts || [];
    if (postResult.length < 5) {
      setAllPostsLoaded(true);
    }
    console.log(postResult);
    dispatchPosts({ type: 'ADD_POSTS', posts: postResult });
  }, []);

  const deletePost = React.useCallback((postId: string) => {
    dispatchPosts({ type: 'DELETE_POST', postId });
  }, []);

  return (
    <PostsContext.Provider value={{ posts, allPostsLoaded, setPostsFromSSR, loadPosts, deletePost }}>
      {children}
    </PostsContext.Provider>
  );
};

export default PostsContext;
