import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Send, ChevronLeft, MessageCircle, Clock, Heart } from 'lucide-react';

const getToken = () => localStorage.getItem('token');

const CommentSection = () => {
  const { id: imageId } = useParams();
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const commentsEndRef = useRef(null);
  const [loadingImage, setLoadingImage] = useState(true);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const API = import.meta.env.VITE_API_URL;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserIdFromToken = () => {
    const token = getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId;
    } catch {
      return null;
    }
  };

  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchData = async () => {
      setLoadingImage(true);
      try {
        const res = await axios.get(`${API}/api/image/get/${imageId}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setImage(res.data.image);
        setImageUrl(res.data.image.url);
        setComments(res.data.image.comments || []);
      } catch (err) {
        console.error('Error fetching image or comments:', err);
      } finally {
        setLoadingImage(false);
      }
    };

    fetchData();
  }, [imageId]);

  useEffect(() => {
    if (image && image.likes) {
      setLikesCount(image.likes.length);
      setIsLiked(image.likes.includes(userId));
    }
  }, [image, userId]);

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const res = await axios.post(
        `${API}/api/image/like/${image._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const { liked, totalLikes } = res.data;
      setIsLiked(liked);
      setLikesCount(totalLikes);
    } catch (err) {
      console.error('Error liking image:', err);
    }
  };

  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments]);

  const handleComment = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${API}/api/image/comment/${imageId}`,
        { text },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setText('');
      setComments(res.data.comments);
    } catch (err) {
      console.error('Comment error:', err);
    }
    setLoading(false);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await axios.delete(
        `${API}/api/image/comment/${imageId}/${commentId}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setComments(res.data.comments);
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleComment();
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden py-16 md:py-20">
      <div className="flex flex-col md:flex-row h-screen max-h-screen">
        <div className="w-full md:w-3/5 bg-gradient-to-br from-indigo-950 to-gray-900 relative">
          <button 
            onClick={() => window.history.back()} 
            className="absolute top-4 left-4 z-10 bg-white/10 hover:bg-white/20 p-2.5 rounded-full text-white backdrop-blur-sm transition-all duration-300 shadow-lg"
          >
            <ChevronLeft size={20} />
          </button>

          {loadingImage ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-400"></div>
            </div>
          ) : (
            <>
              <div className="h-full flex items-center justify-center bg-gradient-to-br from-indigo-950 to-gray-900 overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt={image?.title || "Image"} 
                  className="max-h-full max-w-full object-contain shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-6 pb-8 text-white backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300">{image?.title || "Untitled"}</h2>
                {image?.description && (
                  <p className="text-sm text-gray-300 mb-5 max-w-xl leading-relaxed">{image.description}</p>
                )}
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white ring-2 ring-purple-400/30 shadow-lg">
                      {image?.uploadedBy?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{image?.uploadedBy?.username || "Unknown user"}</p>
                      <div className="flex items-center text-xs text-indigo-300">
                        <Clock size={12} className="mr-1" />
                        <span>{formatDate(image?.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button 
                      className="py-2 px-4 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 flex items-center shadow-lg backdrop-blur-sm"
                      onClick={handleLike}
                    >
                      <Heart 
                        size={18} 
                        className={`transition-all duration-300 ${isLiked ? 'text-pink-500 fill-pink-500' : 'text-gray-300'}`}
                      />
                      <span className="text-sm font-medium ml-2">{likesCount}</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="w-full md:w-2/5 flex flex-col h-full border-l border-indigo-100">
          <div className="px-6 py-4 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center">
              <MessageCircle className="text-indigo-600 mr-2" size={20} />
              <h3 className="text-lg font-semibold text-indigo-900">Comments ({comments.length})</h3>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto px-6 py-4 bg-white">
            {comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
                <MessageCircle size={48} className="mb-4 opacity-30 text-indigo-300" />
                <p className="text-center font-medium text-indigo-800">No comments yet</p>
                <p className="text-sm text-indigo-400 mt-1">Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div className="space-y-5">
                {comments.map((comment, i) => (
                  <div key={i} className="flex group">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                      {comment.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="ml-3 flex-grow">
                      <div className="bg-indigo-50 rounded-2xl p-3.5 group-hover:bg-indigo-100 transition-all duration-300 shadow-sm">
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-indigo-900">{comment.username}</span>
                          <span className="text-xs text-indigo-400">{formatDate(comment.timestamp)}</span>
                        </div>
                        <p className="text-gray-700 mt-1.5 leading-relaxed">{comment.text}</p>
                      </div>
                      {comment.userId === userId && (
                        <div className="flex mt-1 ml-1 space-x-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors duration-300"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={commentsEndRef} />
              </div>
            )}
          </div>

          <div className="p-5 border-t border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Write a comment..."
                className="w-full border border-indigo-200 rounded-xl py-3.5 px-4 pr-14 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-300"
                rows="2"
              />
              <button
                onClick={handleComment}
                disabled={loading || !text.trim()}
                className={`absolute right-3 bottom-3 p-2.5 rounded-full transition-all duration-300 ${
                  loading || !text.trim()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-lg hover:from-indigo-700 hover:to-violet-700'
                }`}
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-xs text-indigo-400 mt-2 text-right">Press Enter to send</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;