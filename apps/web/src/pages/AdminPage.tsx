import React, { useState } from 'react';
import { 
  Shield, Plus, HardDrive, CheckCircle2, 
  Eye, EyeOff, Trash2, X
} from 'lucide-react';
import { MOCK_MOVIES, ExtendedMovie } from '../mock/data';
import { ZERO_COST_LIMITS } from '@movie/shared';

export const AdminPage: React.FC = () => {
  const [movies, setMovies] = useState<ExtendedMovie[]>(MOCK_MOVIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newYear, setNewYear] = useState('2024');
  const [newGenre, setNewGenre] = useState('Action');

  // Storage calculation estimate (e.g. 1.2 GB per movie average)
  const estimatedStorageBytes = movies.length * 1.15 * 1024 * 1024 * 1024;
  const storageLimitBytes = ZERO_COST_LIMITS.TARGET_STORAGE_BYTES;
  const storagePercent = Math.min(100, (estimatedStorageBytes / storageLimitBytes) * 100);

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
    if (confirm('Are you sure you want to delete this movie record?')) {
      setMovies(prev => prev.filter(m => m.id !== movieId));
    }
  };

  const handleCreateMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newMovie: ExtendedMovie = {
      id: `movie-${Date.now()}`,
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/\s+/g, '-'),
      description: 'Newly registered movie entry ready for media pipeline processing.',
      releaseYear: parseInt(newYear) || 2024,
      durationSeconds: 7200,
      posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80',
      backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
      status: 'DRAFT',
      renditions: ['480p', '720p'],
      rating: 8.0,
      director: 'Independent Creator',
      cast: ['Actor One', 'Actor Two'],
      genres: [{ id: newGenre.toLowerCase(), name: newGenre, slug: newGenre.toLowerCase() }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setMovies([newMovie, ...movies]);
    setIsModalOpen(false);
    setNewTitle('');
  };

  return (
    <div className="container admin-page-root">
      <div className="admin-header-row">
        <div>
          <div className="header-icon-badge">
            <Shield size={20} color="#818cf8" />
            <h1 className="page-title">Admin Management Console</h1>
          </div>
          <p className="page-subtitle">
            Manage video catalog, monitor Cloudflare R2 zero-cost storage quotas, and control publication.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn-add-movie">
          <Plus size={18} />
          <span>Register New Movie</span>
        </button>
      </div>

      {/* Storage & Zero-Cost Guard Telemetry Card */}
      <div className="telemetry-card">
        <div className="telemetry-header">
          <div className="telemetry-title">
            <HardDrive size={18} color="#38bdf8" />
            <h3>Cloudflare R2 Storage Guard (Zero-Cost Free Tier)</h3>
          </div>
          <span className="telemetry-badge healthy">
            <CheckCircle2 size={14} /> System Healthy
          </span>
        </div>

        <div className="storage-meter">
          <div className="storage-meter-fill" style={{ width: `${storagePercent}%` }} />
        </div>

        <div className="storage-stats-row">
          <span>Current Estimated Footprint: <strong>{(estimatedStorageBytes / (1024 ** 3)).toFixed(2)} GB</strong></span>
          <span>Target Safety Ceiling: <strong>8.00 GB</strong> (Cloudflare 10 GB Free Limit)</span>
        </div>
      </div>

      {/* Movie Management Table */}
      <div className="admin-table-card">
        <h3>Catalog Entries ({movies.length})</h3>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Movie</th>
                <th>Year</th>
                <th>Renditions</th>
                <th>Media Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map(movie => (
                <tr key={movie.id}>
                  <td>
                    <div className="movie-table-cell">
                      <img src={movie.posterUrl} alt={movie.title} className="table-thumb" />
                      <div>
                        <div className="table-movie-title">{movie.title}</div>
                        <div className="table-movie-genre">{movie.genres.map(g => g.name).join(', ')}</div>
                      </div>
                    </div>
                  </td>
                  <td>{movie.releaseYear}</td>
                  <td>
                    <span className="table-rendition-tag">{movie.renditions.join(', ')}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${movie.status.toLowerCase()}`}>
                      {movie.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-actions">
                      <button 
                        onClick={() => togglePublish(movie.id)}
                        className={`btn-table-action ${movie.status === 'PUBLISHED' ? 'unpublish' : 'publish'}`}
                        title={movie.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                      >
                        {movie.status === 'PUBLISHED' ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>

                      <button 
                        onClick={() => deleteMovie(movie.id)}
                        className="btn-table-action delete"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for adding new movie entry */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Register New Movie Entry</h3>
              <button onClick={() => setIsModalOpen(false)} className="btn-close-modal">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateMovie} className="modal-form">
              <div className="form-group">
                <label>Movie Title</label>
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Interstellar Odyssey" 
                  required 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Release Year</label>
                  <input 
                    type="number" 
                    value={newYear} 
                    onChange={(e) => setNewYear(e.target.value)}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Genre</label>
                  <select value={newGenre} onChange={(e) => setNewGenre(e.target.value)}>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Action">Action</option>
                    <option value="Drama">Drama</option>
                    <option value="Thriller">Thriller</option>
                    <option value="Animation">Animation</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Save Movie Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
