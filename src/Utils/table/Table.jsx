import React from 'react';
import './Table.css';

export default function Table({ column = [], tableData = [] }) {
    const getColumnKey = (col) => (typeof col === 'object' ? col.key : col);
    const getColumnLabel = (col) => {
        if (typeof col === 'object' && col.label) return col.label;
        if (typeof col === 'string') {
            // Convert camelCase or snake_case to readable header
            return col
                .replace(/([A-Z])/g, ' $1')
                .replace(/_/g, ' ')
                .trim()
                .toUpperCase();
        }
        return String(col);
    };

    const renderCellContent = (key, value) => {
        if (value === null || value === undefined || value === '') {
            return <span className="table-cell-empty">—</span>;
        }

        if (key === 'createdAt' || key.toLowerCase().includes('date')) {
            try {
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                    return (
                        <span className="table-mono-date" title={value}>
                            {date.toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}{' '}
                            {date.toLocaleTimeString(undefined, {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </span>
                    );
                }
            } catch {
                return String(value);
            }
        }

        if (key === 'tags' && typeof value === 'string') {
            const tags = value.split(':').filter(Boolean);
            if (tags.length === 0) return <span className="table-cell-empty">—</span>;
            return (
                <div className="table-tags-container">
                    {tags.map((tag, idx) => (
                        <span key={idx} className="table-tag-badge">
                            #{tag}
                        </span>
                    ))}
                </div>
            );
        }

        if (key === 'slug') {
            return <span className="table-mono-slug">{value}</span>;
        }

        if (key === 'name') {
            return <span className="table-row-name">{value}</span>;
        }

        if (key === 'issued_value') {
            return <span className="table-mono-num">{value}</span>;
        }

        return String(value);
    };

    return (
        <div className="brutalist-table-wrapper">
            <table className="brutalist-table">
                <thead>
                    <tr>
                        {column.map((col, index) => (
                            <th key={index}>{getColumnLabel(col)}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tableData.length === 0 ? (
                        <tr>
                            <td colSpan={column.length || 1} className="table-empty-message">
                                [ NO WORKSPACES RECORDED ]
                            </td>
                        </tr>
                    ) : (
                        tableData.map((row, rowIndex) => (
                            <tr key={row.id || rowIndex}>
                                {column.map((col, colIndex) => {
                                    const key = getColumnKey(col);
                                    return (
                                        <td key={colIndex}>
                                            {renderCellContent(key, row[key])}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
