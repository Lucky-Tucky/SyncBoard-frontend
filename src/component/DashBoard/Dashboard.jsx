import React, { useCallback, useEffect, useState } from 'react';
import { getAll as getAllWorkspaces } from '../../api/workSpace';
import { getAll as getAllProjects } from '../../api/projectApi';
import './DashBoard.css';
import Table from '../../Utils/table/Table';

const TABLE_COLUMNS = ['name', 'slug', 'tags', 'issued_value', 'createdAt'];

export default function Dashboard() {
    const [recentWorkspaces, setRecentWorkspaces] = useState([]);
    const [workspacesLoading, setWorkspacesLoading] = useState(true);
    const [workspaceViewMode, setWorkspaceViewMode] = useState('grid'); // 'grid' | 'table'

    const [recentProjects, setRecentProjects] = useState([]);
    const [projectsLoading, setProjectsLoading] = useState(true);
    const [projectViewMode, setProjectViewMode] = useState('grid'); // 'grid' | 'table'

    // Both follow the exact same query params
    const queryParams = {
        pageSize: 3,
        pageIndex: 0,
        order: 'asc',
        column: 'createdAt'
    };

    const fetchWorkspaces = useCallback(async () => {
        setWorkspacesLoading(true);
        try {
            const response = await getAllWorkspaces(queryParams);
            const items = Array.isArray(response) ? response : (response?.data || []);
            setRecentWorkspaces(items);
        } catch (err) {
            console.error('Failed to load recent workspaces:', err);
            setRecentWorkspaces([]);
        } finally {
            setWorkspacesLoading(false);
        }
    }, []);

    const fetchProjects = useCallback(async () => {
        setProjectsLoading(true);
        try {
            const response = await getAllProjects(queryParams);
            const items = Array.isArray(response) ? response : (response?.data || []);
            setRecentProjects(items);
        } catch (err) {
            console.error('Failed to load recent projects:', err);
            setRecentProjects([]);
        } finally {
            setProjectsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWorkspaces();
        fetchProjects();
    }, [fetchWorkspaces, fetchProjects]);

    const parseTags = (tagStr) => {
        if (!tagStr || typeof tagStr !== 'string') return [];
        return tagStr.split(':').filter(Boolean);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            return d.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }) + ' ' + d.toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateStr;
        }
    };

    const renderCardGrid = (items, type) => (
        <div className="boards-grid">
            {items.map((item, index) => {
                const tags = parseTags(item.tags);
                return (
                    <div key={item.id || index} className="board-card">
                        <div className="card-top">
                            <div className="card-tags">
                                <span className="tag-badge tag-active">
                                    {item.slug || 'NO_SLUG'}
                                </span>
                                {tags.map((tag, idx) => (
                                    <span key={idx} className="tag-badge">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                            <h3>{item.name}</h3>
                        </div>
                        <div>
                            <div className="card-meta">
                                <span>CREATED: {formatDate(item.createdAt)}</span>
                                {item.issued_value !== undefined && (
                                    <span>ISSUED: {item.issued_value}</span>
                                )}
                            </div>
                            <div className="card-actions">
                                <button
                                    type="button"
                                    className="card-btn"
                                    onClick={() => {
                                        console.log(`Open ${type}:`, item);
                                    }}
                                >
                                    [OPEN]
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="dashboard-container">
            {/* 1. Recently Added Workspaces Section */}
            <section className="dashboard-section">
                <div className="section-header">
                    <h2>Recently Added Workspaces</h2>
                    <div className="filter-buttons">
                        <button
                            type="button"
                            className={`filter-btn ${workspaceViewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setWorkspaceViewMode('grid')}
                        >
                            [ Cards View ]
                        </button>
                        <button
                            type="button"
                            className={`filter-btn ${workspaceViewMode === 'table' ? 'active' : ''}`}
                            onClick={() => setWorkspaceViewMode('table')}
                        >
                            [ Table View ]
                        </button>
                    </div>
                </div>

                {workspacesLoading ? (
                    <div className="empty-state">
                        <p>[ LOADING RECENT WORKSPACES... ]</p>
                    </div>
                ) : recentWorkspaces.length === 0 ? (
                    <div className="empty-state">
                        <p>[ NO RECENT WORKSPACES FOUND ]</p>
                    </div>
                ) : workspaceViewMode === 'grid' ? (
                    renderCardGrid(recentWorkspaces, 'workspace')
                ) : (
                    <Table column={TABLE_COLUMNS} tableData={recentWorkspaces} />
                )}
            </section>

            {/* 2. Recently Added Projects Section */}
            <section className="dashboard-section">
                <div className="section-header">
                    <h2>Recently Added Projects</h2>
                    <div className="filter-buttons">
                        <button
                            type="button"
                            className={`filter-btn ${projectViewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setProjectViewMode('grid')}
                        >
                            [ Cards View ]
                        </button>
                        <button
                            type="button"
                            className={`filter-btn ${projectViewMode === 'table' ? 'active' : ''}`}
                            onClick={() => setProjectViewMode('table')}
                        >
                            [ Table View ]
                        </button>
                    </div>
                </div>

                {projectsLoading ? (
                    <div className="empty-state">
                        <p>[ LOADING RECENT PROJECTS... ]</p>
                    </div>
                ) : recentProjects.length === 0 ? (
                    <div className="empty-state">
                        <p>[ NO RECENT PROJECTS FOUND ]</p>
                    </div>
                ) : projectViewMode === 'grid' ? (
                    renderCardGrid(recentProjects, 'project')
                ) : (
                    <Table column={TABLE_COLUMNS} tableData={recentProjects} />
                )}
            </section>
        </div>
    );
}
