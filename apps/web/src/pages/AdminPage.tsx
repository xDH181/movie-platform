import React, { useState } from 'react';
import { 
  Shield, Plus, HardDrive, CheckCircle2, 
  Eye, EyeOff, Trash2, X, Search, Star, 
  Film, Zap, Play, Database
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_MOVIES, ExtendedMovie } from '../mock/data';
import { ZERO_COST_LIMITS } from '@movie/shared';

export const AdminPage: React.FC = () => {
  const [movies, setMovies] = useState<ExtendedMovie[]>(MOCK_MOVIES);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newYear, setNewYear] = useState('2024');
  const [newGenre, setNewGenre] = useState('Sci-Fi');
  const [newRating, setNewRating] = useState('8.5');
  const navigate = useNavigate();

  // Storage calculation estimate (e.g. 1.15 GB per movie average)
  const estimatedStorageBytes = movies.length * 1.15 * 1024 * 1024 * 1024;
  const storageLimitBytes = ZERO_COST_LIMITS.TARGET_STORAGE_BYTES;
  const storagePercent = Math.min(100, (estimatedStorageBytes / storageLimitBytes) * 100);

  const publishedCount = movies.filter(m => m.status === 'PUBLISHED').length;
  const draftCount = movies.filter(m => m.status === 'DRAFT').length;

  const togglePublish = (movieId: string) => {
    setMovies(prev => prev.map(m => {
      if (m.id === movieId) {
        return {
          ...m,
          status: m.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
        };
      }
      return m;
    }));
  };

  const deleteMovie = (movieId: string) => {
    if (confirm('Xác nhận xóa bản ghi phim này khỏi hệ thống?')) {
      setMovies(prev => prev.filter(m => m.id !== movieId));
    }
  };

  const handleCreateMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newMovie: ExtendedMovie = {
      id: `movie-${Date.now()}`,
      title: newTitle.trim(),
      slug: newTitle.toLowerCase().replace(/\s+/g, '-'),
      description: 'Phim mới đăng ký đã sẵn sàng chuyển mã và đẩy lên Cloudflare R2.',
      releaseYear: parseInt(newYear) || 2024,
      durationSeconds: 7200,
      posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
      status: 'PUBLISHED',
      renditions: ['480p', '720p'],
      rating: parseFloat(newRating) || 8.0,
      director: 'Đạo Diễn Độc Lập',
      cast: ['Diễn Viên Chính', 'Diễn Viên Phụ'],
      genres: [{ id: newGenre.toLowerCase(), name: newGenre, slug: newGenre.toLowerCase() }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setMovies([newMovie, ...movies]);
    setIsModalOpen(false);
    setNewTitle('');
  };

  // Filtered movie list
  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      movie.genres.some(g => g.name.toLowerCase().includes(searchFilter.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || movie.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container admin-studio-root">
      {/* 1. COMPACT CINEMATIC ADMIN HEADER */}
      <div className="admin-compact-header">
        <div className="admin-title-cluster">
          <div className="admin-badge-row">
            <span className="admin-micro-pill">
              <Shield size={12} /> STUDIO QUẢN TRỊ
            </span>
            <span className="admin-status-indicator">
              <span className="indicator-dot-emerald" /> R2 Live Sync
            </span>
          </div>
          <h1 className="admin-headline-title">Hệ Thống Quản Lý Phim & Hạ Tầng</h1>
          <p className="admin-headline-sub">
            Điều phối kho phim HLS, giám sát định mức Cloudflare R2 và kiểm soát phát hành zero-cost.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn-compact-add-movie">
          <Plus size={15} />
          <span>Thêm Phim Mới</span>
        </button>
      </div>

      {/* 2. COMPACT STATS & TELEMETRY WIDGETS (4 Dense Cards) */}
      <div className="admin-widgets-grid">
        {/* Widget 1: Total Catalog */}
        <div className="admin-widget-card">
          <div className="widget-icon-head">
            <Film size={16} color="#38bdf8" />
            <span className="widget-name">Tổng Kho Phim</span>
          </div>
          <div className="widget-value-row">
            <span className="widget-main-num">{movies.length}</span>
            <span className="widget-sub-badge">{publishedCount} Đã Phát Hành</span>
          </div>
          <div className="widget-footer-line">
            <span>{draftCount} bản nháp lưu trữ</span>
          </div>
        </div>

        {/* Widget 2: R2 Storage Meter */}
        <div className="admin-widget-card">
          <div className="widget-icon-head">
            <HardDrive size={16} color="#10b981" />
            <span className="widget-name">Cloudflare R2 Storage</span>
          </div>
          <div className="widget-value-row">
            <span className="widget-main-num">{(estimatedStorageBytes / (1024 ** 3)).toFixed(2)} <span className="widget-unit">GB</span></span>
            <span className="widget-ceiling-tag">/ 8.00 GB Trần</span>
          </div>
          <div className="admin-progress-meter">
            <div 
              className="admin-meter-fill" 
              style={{ 
                width: `${storagePercent}%`,
                background: storagePercent > 80 ? 'var(--accent-crimson)' : 'var(--accent-emerald)'
              }} 
            />
          </div>
        </div>

        {/* Widget 3: Zero-Cost Egress Status */}
        <div className="admin-widget-card">
          <div className="widget-icon-head">
            <Zap size={16} color="#e5a93c" />
            <span className="widget-name">Chi Phí Egress</span>
          </div>
          <div className="widget-value-row">
            <span className="widget-main-num">$0.00 <span className="widget-unit">/tháng</span></span>
            <span className="widget-health-badge">
              <CheckCircle2 size={11} /> 100% Free
            </span>
          </div>
          <div className="widget-footer-line">
            <span>Workers Cache: ~14ms latency</span>
          </div>
        </div>

        {/* Widget 4: Video Pipeline */}
        <div className="admin-widget-card">
          <div className="widget-icon-head">
            <Database size={16} color="#a855f7" />
            <span className="widget-name">Chất Lượng Video</span>
          </div>
          <div className="widget-value-row">
            <span className="widget-main-num">HLS <span className="widget-unit">Adaptive</span></span>
            <span className="widget-sub-badge">720p / 480p</span>
          </div>
          <div className="widget-footer-line">
            <span>HLS.js Zero-Canvas Rendering</span>
          </div>
        </div>
      </div>

      {/* 3. COMPACT SEARCH & FILTER TOOLBAR */}
      <div className="admin-toolbar-panel">
        <div className="admin-search-box">
          <Search size={14} className="admin-search-icon" />
          <input
            type="text"
            className="admin-search-input"
            placeholder="Tìm theo tên phim hoặc thể loại..."
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
          />
          {searchFilter && (
            <button className="btn-clear-admin-search" onClick={() => setSearchFilter('')}>
              <X size={13} />
            </button>
          )}
        </div>

        <div className="admin-filter-tabs">
          <button 
            className={`admin-filter-btn ${statusFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setStatusFilter('ALL')}
          >
            Tất Cả ({movies.length})
          </button>
          <button 
            className={`admin-filter-btn ${statusFilter === 'PUBLISHED' ? 'active' : ''}`}
            onClick={() => setStatusFilter('PUBLISHED')}
          >
            Đã Phát Hành ({publishedCount})
          </button>
          <button 
            className={`admin-filter-btn ${statusFilter === 'DRAFT' ? 'active' : ''}`}
            onClick={() => setStatusFilter('DRAFT')}
          >
            Bản Nháp ({draftCount})
          </button>
        </div>
      </div>

      {/* 4. COMPACT REFINED MOVIE TABLE */}
      <div className="admin-table-container">
        <div className="table-wrapper">
          <table className="admin-compact-table">
            <thead>
              <tr>
                <th style={{ width: '42%' }}>Tên Phim & Thể Loại</th>
                <th style={{ width: '12%' }}>Năm & Điểm</th>
                <th style={{ width: '16%' }}>Định Dạng HLS</th>
                <th style={{ width: '15%' }}>Trạng Thái</th>
                <th style={{ width: '15%', textAlign: 'right' }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="table-empty-cell">
                    Không có phim nào khớp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredMovies.map(movie => (
                  <tr key={movie.id} className="admin-table-row">
                    <td>
                      <div className="table-movie-cell">
                        <div className="table-thumb-wrap">
                          <img src={movie.posterUrl} alt={movie.title} className="table-thumb-img" />
                          <span className="table-thumb-fmt">
                            {movie.renditions.includes('720p') ? 'FHD' : 'HD'}
                          </span>
                        </div>
                        <div className="table-title-group">
                          <span className="table-main-title">{movie.title}</span>
                          <div className="table-genre-row">
                            {movie.genres.map(g => (
                              <span key={g.id} className="table-genre-pill">{g.name}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="table-meta-cluster">
                        <span className="table-year-text">{movie.releaseYear}</span>
                        <span className="table-star-score">
                          <Star size={11} fill="#e5a93c" color="#e5a93c" />
                          {movie.rating.toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="table-renditions-list">
                        {movie.renditions.map(r => (
                          <span key={r} className="table-rendition-chip">{r}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className={`table-status-pill ${movie.status === 'PUBLISHED' ? 'published' : 'draft'}`}>
                        <span className="status-dot-mini" />
                        {movie.status === 'PUBLISHED' ? 'Phát Hành' : 'Bản Nháp'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="table-actions-cluster">
                        <button 
                          onClick={() => navigate(`/watch/${movie.id}`)}
                          className="btn-action-tool play"
                          title="Xem thử phim"
                        >
                          <Play size={13} />
                        </button>

                        <button 
                          onClick={() => togglePublish(movie.id)}
                          className={`btn-action-tool ${movie.status === 'PUBLISHED' ? 'unpublish' : 'publish'}`}
                          title={movie.status === 'PUBLISHED' ? 'Chuyển về Bản Nháp' : 'Xuất bản phim'}
                        >
                          {movie.status === 'PUBLISHED' ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>

                        <button 
                          onClick={() => deleteMovie(movie.id)}
                          className="btn-action-tool delete"
                          title="Xóa bản ghi"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. COMPACT REGISTRATION MODAL */}
      {isModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal-window" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="modal-title-cluster">
                <span className="modal-subtitle-tag">THÊM NỘI DUNG MỚI</span>
                <h3 className="modal-headline">Đăng Ký Phim Mới Vào Kho R2</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="btn-modal-close">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateMovie} className="admin-modal-form">
              <div className="form-field-group">
                <label className="form-label-text">Tên Phim (Tiếng Việt hoặc Tiếng Anh)</label>
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Kỷ Nguyên Ảo: 2099" 
                  className="form-compact-input"
                  required 
                  autoFocus
                />
              </div>

              <div className="form-two-cols">
                <div className="form-field-group">
                  <label className="form-label-text">Năm Phát Hành</label>
                  <input 
                    type="number" 
                    value={newYear} 
                    onChange={(e) => setNewYear(e.target.value)}
                    className="form-compact-input"
                    required 
                  />
                </div>

                <div className="form-field-group">
                  <label className="form-label-text">Thể Loại Chính</label>
                  <select 
                    value={newGenre} 
                    onChange={(e) => setNewGenre(e.target.value)}
                    className="form-compact-select"
                  >
                    <option value="Sci-Fi">Viễn Tưởng (Sci-Fi)</option>
                    <option value="Action">Hành Động (Action)</option>
                    <option value="Drama">Kịch Tính (Drama)</option>
                    <option value="Thriller">Giật Gân (Thriller)</option>
                    <option value="Animation">Hoạt Hình (Animation)</option>
                  </select>
                </div>
              </div>

              <div className="form-field-group">
                <label className="form-label-text">Điểm Đánh Giá Mặc Định (1.0 - 10.0)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  min="1" 
                  max="10" 
                  value={newRating} 
                  onChange={(e) => setNewRating(e.target.value)}
                  className="form-compact-input"
                  required 
                />
              </div>

              <div className="modal-footer-cluster">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-modal-secondary">
                  Hủy Bỏ
                </button>
                <button type="submit" className="btn-modal-primary">
                  Lưu & Xuất Bản Phim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
