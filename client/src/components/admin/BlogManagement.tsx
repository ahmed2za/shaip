import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const BlogEditor = dynamic(() => import('./BlogEditor'), { ssr: false });

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published: boolean;
  coverImage: string;
  createdAt: string;
  categories: { name: string }[];
}

export default function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/blog/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = () => {
    setSelectedPost(null);
    setShowEditor(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setSelectedPost(post);
    setShowEditor(true);
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return;

    try {
      await fetch(`/api/admin/blog/posts/${postId}`, {
        method: 'DELETE',
      });
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleSavePost = async (postData: any) => {
    try {
      const method = selectedPost ? 'PUT' : 'POST';
      const url = selectedPost
        ? `/api/admin/blog/posts/${selectedPost.id}`
        : '/api/admin/blog/posts';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        await fetchPosts();
        setShowEditor(false);
        setSelectedPost(null);
      }
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  if (showEditor) {
    return (
      <BlogEditor
        post={selectedPost}
        onSave={handleSavePost}
        onCancel={() => setShowEditor(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">إدارة المدونة</h2>
        <button
          onClick={handleCreatePost}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 ml-2" />
          مقال جديد
        </button>
      </div>

      {isLoading ? (
        <div>جاري التحميل...</div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-md">
          <ul className="divide-y divide-gray-200">
            {posts.map((post) => (
              <li key={post.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    {post.coverImage && (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="h-16 w-16 object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {post.title}
                      </h3>
                      <div className="mt-1 flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-500">
                        <span>
                          {format(new Date(post.createdAt), 'dd MMMM yyyy', {
                            locale: ar,
                          })}
                        </span>
                        <span>•</span>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            post.published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {post.published ? 'منشور' : 'مسودة'}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center space-x-2 rtl:space-x-reverse">
                        {post.categories.map((category) => (
                          <span
                            key={category.name}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {category.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <button
                      onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEditPost(post)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
