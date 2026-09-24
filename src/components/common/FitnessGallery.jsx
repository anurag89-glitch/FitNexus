import React, { useState, useRef } from 'react';
import { Camera, Plus, X, Trash2, ZoomIn, ChevronLeft } from 'lucide-react';
import { ACTIVITY_GALLERY_OPTIONS } from '../../data/arenaData';
import { sounds } from '../../utils/audio';

/**
 * GalleryImagePlaceholder – renders a colored square with emoji since we have no real
 * image server; when dataUrl exists it renders the actual uploaded image.
 */
function GalleryThumb({ post, onClick }) {
  const bg = post.dataUrl
    ? `url(${post.dataUrl}) center/cover no-repeat`
    : post.imageColor || '#1a2a4c';

  const activityOpt = ACTIVITY_GALLERY_OPTIONS.find(a => a.value === post.activity);

  return (
    <div
      onClick={onClick}
      style={{
        width: '100%',
        paddingBottom: '100%',
        position: 'relative',
        borderRadius: '10px',
        overflow: 'hidden',
        cursor: 'pointer',
        background: post.dataUrl ? undefined : bg,
        backgroundImage: post.dataUrl ? `url(${post.dataUrl})` : undefined,
        backgroundSize: post.dataUrl ? 'cover' : undefined,
        backgroundPosition: 'center',
        border: '1px solid rgba(255,255,255,0.08)'
      }}
    >
      {!post.dataUrl && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `radial-gradient(circle at 50% 40%, ${post.imageColor || '#1a2a4c'} 0%, #070e1c 100%)`
        }}>
          <span style={{ fontSize: '28px' }}>{post.imageEmoji || activityOpt?.label?.split(' ')[0] || '📸'}</span>
        </div>
      )}
      {/* Hover overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,210,255,0.12)',
        opacity: 0,
        transition: 'opacity 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
        className="gallery-thumb-hover"
      >
        <ZoomIn size={20} color="#fff" />
      </div>
    </div>
  );
}

/** Full-screen post viewer */
function PostViewer({ post, isOwner, onClose, onDelete }) {
  const activityOpt = ACTIVITY_GALLERY_OPTIONS.find(a => a.value === post.activity);
  const bg = post.dataUrl
    ? `url(${post.dataUrl}) center/cover no-repeat`
    : `radial-gradient(circle at 50% 40%, ${post.imageColor || '#1a2a4c'} 0%, #070e1c 100%)`;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 95,
      background: 'rgba(4,8,18,0.97)',
      display: 'flex',
      flexDirection: 'column',
      animation: 'modalFadeIn 0.2s ease-out'
    }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
        <button className="icon-btn" onClick={onClose}><ChevronLeft size={20} /></button>
        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {activityOpt ? activityOpt.label : '📸 Fitness Post'}
        </span>
        {isOwner ? (
          <button
            className="icon-btn"
            onClick={onDelete}
            style={{ color: 'var(--accent-red)' }}
          >
            <Trash2 size={18} />
          </button>
        ) : (
          <div style={{ width: 38 }} />
        )}
      </div>

      {/* Image */}
      <div style={{
        width: '100%',
        flex: '0 0 auto',
        aspectRatio: '1 / 1',
        background: bg,
        display: post.dataUrl ? undefined : 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {!post.dataUrl && (
          <span style={{ fontSize: '64px' }}>
            {post.imageEmoji || activityOpt?.label?.split(' ')[0] || '📸'}
          </span>
        )}
      </div>

      {/* Caption */}
      {post.caption && (
        <div style={{ padding: '16px 20px' }}>
          <p style={{ fontSize: '14px', color: '#fff', lineHeight: 1.5 }}>{post.caption}</p>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', display: 'block' }}>
            {new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
      )}
    </div>
  );
}

/** Add Post modal / sheet */
function AddPostModal({ onClose, onAdd, currentUserId }) {
  const [step, setStep] = useState('form'); // 'form' | 'preview'
  const [caption, setCaption] = useState('');
  const [activity, setActivity] = useState('');
  const [dataUrl, setDataUrl] = useState(null);
  const [imageEmoji, setImageEmoji] = useState('📸');
  const [imageColor, setImageColor] = useState('#1a3a5c');
  const fileRef = useRef();

  const COLORS = ['#1a3a5c', '#2a1a4c', '#1c3020', '#3a1a1a', '#1a2a4c', '#2c1a3c'];
  const EMOJIS = ['🏃', '💪', '🚴', '🧘', '🏋️', '⚽', '🏊', '🏆', '📈', '🔥'];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setDataUrl(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handlePost = () => {
    const newPost = {
      id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      userId: currentUserId || 'me',
      dataUrl,
      imageEmoji,
      imageColor,
      caption: caption.trim(),
      activity,
      createdAt: new Date().toISOString()
    };
    sounds.repSuccess?.();
    onAdd(newPost);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content-sheet"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '88%' }}
      >
        <div className="modal-grabber" />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <h3 style={{ fontSize: '18px', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            📸 Add Fitness Post
          </h3>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Share a workout photo, achievement, or progress snap
        </p>

        {/* Image Picker */}
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            width: '100%',
            aspectRatio: '4/3',
            borderRadius: '16px',
            border: '2px dashed var(--border-cyan)',
            background: dataUrl ? undefined : 'rgba(0,210,255,0.04)',
            backgroundImage: dataUrl ? `url(${dataUrl})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {!dataUrl && (
            <>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'rgba(0,210,255,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}>
                <Camera size={24} color="var(--accent-cyan)" />
              </div>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Tap to select photo
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Or choose emoji below
              </span>
            </>
          )}
          {dataUrl && (
            <button
              onClick={(e) => { e.stopPropagation(); setDataUrl(null); }}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />

        {/* Emoji & color picker (shown when no image uploaded) */}
        {!dataUrl && (
          <>
            <div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>PICK AN EMOJI</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {EMOJIS.map(em => (
                  <button
                    key={em}
                    onClick={() => setImageEmoji(em)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      border: imageEmoji === em ? '2px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                      background: imageEmoji === em ? 'rgba(0,210,255,0.12)' : 'rgba(255,255,255,0.04)',
                      fontSize: '20px',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >{em}</button>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>BACKGROUND COLOR</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setImageColor(c)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: c,
                      border: imageColor === c ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Caption */}
        <div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>CAPTION (optional)</p>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="What did you achieve today? 🔥"
            maxLength={200}
            rows={2}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '10px 14px',
              color: '#fff',
              fontSize: '13.5px',
              fontFamily: 'var(--font-body)',
              resize: 'none',
              outline: 'none'
            }}
          />
        </div>

        {/* Activity */}
        <div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>ACTIVITY (optional)</p>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {ACTIVITY_GALLERY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setActivity(activity === opt.value ? '' : opt.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '99px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  border: activity === opt.value ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  background: activity === opt.value ? 'rgba(0,210,255,0.15)' : 'rgba(255,255,255,0.04)',
                  color: activity === opt.value ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Post Button */}
        <button
          className="btn-primary"
          onClick={handlePost}
          style={{ marginTop: '4px' }}
        >
          <Camera size={18} />
          Post to Fitness Gallery
        </button>
      </div>
    </div>
  );
}

/**
 * FitnessGallery — embeddable section showing gallery grid + upload button
 * @param {Object} props
 * @param {Array}  props.posts     - array of gallery post objects
 * @param {string} props.ownerId   - userId of profile being viewed
 * @param {string} props.viewerId  - userId of currently logged-in user
 * @param {function} props.onAdd   - (post) => void
 * @param {function} props.onDelete - (postId) => void
 */
export default function FitnessGallery({ posts = [], ownerId, viewerId, onAdd, onDelete }) {
  const [viewPost, setViewPost] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const isOwner = ownerId === viewerId || ownerId === 'me';

  return (
    <div className="nexus-card" style={{ padding: '16px' }}>
      {/* Section Header */}
      <div className="section-header" style={{ marginBottom: '14px' }}>
        <span className="section-title" style={{ fontSize: '15px' }}>
          📸 Fitness Gallery
          {posts.length > 0 && (
            <span className="section-badge" style={{ marginLeft: '8px' }}>{posts.length}</span>
          )}
        </span>
        {isOwner && (
          <button
            onClick={() => { sounds.click?.(); setShowAdd(true); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'rgba(0,210,255,0.12)',
              border: '1px solid var(--border-cyan)',
              borderRadius: '99px',
              color: 'var(--accent-cyan)',
              fontSize: '12px',
              fontWeight: 700,
              padding: '5px 12px',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <Plus size={13} />
            Add Post
          </button>
        )}
      </div>

      {/* Grid */}
      {posts.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '28px 16px',
          color: 'var(--text-muted)',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '12px',
          border: '1px dashed var(--border-subtle)'
        }}>
          <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>📷</span>
          <p style={{ fontSize: '13px' }}>No fitness posts yet.</p>
          {isOwner && (
            <p style={{ fontSize: '12px', marginTop: '4px' }}>Share your first workout photo!</p>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
          {posts.map(post => (
            <GalleryThumb
              key={post.id}
              post={post}
              onClick={() => { sounds.click?.(); setViewPost(post); }}
            />
          ))}
        </div>
      )}

      {/* Post Viewer Overlay */}
      {viewPost && (
        <PostViewer
          post={viewPost}
          isOwner={isOwner}
          onClose={() => setViewPost(null)}
          onDelete={() => {
            if (window.confirm('Delete this post?')) {
              onDelete(viewPost.id);
              setViewPost(null);
            }
          }}
        />
      )}

      {/* Add Post Modal */}
      {showAdd && (
        <AddPostModal
          onClose={() => setShowAdd(false)}
          onAdd={onAdd}
          currentUserId={viewerId}
        />
      )}
    </div>
  );
}
